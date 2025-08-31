const Task =require("../models/Task");
//@desc get all tasks (admin:all, user:assigned)
//@route GET /api/tasks
//@access Private/Admin/User

const getTasks=async(req,res)=>{
    try{
        const {status}= req.query; // Get status from query parameters
        let filter = {};
        if (status) {
            filter.status=status; // Filter tasks by status if provided
        }
        let tasks;
        if(req.user.role === 'admin'){
            tasks = await Task.find(filter).populate("assignedTo", "name email profileImageUrl");
        }else{
            tasks = await Task.find({...filter, assignedTo: req.user._id }).populate("assignedTo","name email profileImageUrl"); // Filter tasks assigned to the user
        }
        //add completed todochecklist count 
        tasks=await Promise.all(tasks.map(async (task) => {
            const completedCount = task.todoChecklist.filter(item => item.completed).length;
            return{ ...task._doc,completedTodoCount: completedCount };
        }));
        //status 
        const allTasks=await Task.countDocuments(
            req.user.role === 'admin' ? {} : { assignedTo: req.user._id }
        );
        const pendingTasks=await Task.countDocuments({
            ...filter,
            status: "Pending",
            ...(req.user.role !== 'admin' && { assignedTo: req.user._id }),
        });
        const inProgressTasks=await Task.countDocuments({
            ...filter,
            status: "In Progress",
            ...(req.user.role !== 'admin' && { assignedTo: req.user._id }),
        });
        const completedTasks=await Task.countDocuments({
            ...filter,
            status: "Completed",
            ...(req.user.role !== 'admin' && { assignedTo: req.user._id }),
        });

        res.json({
            tasks,
            statusSummary:{
                all: allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            },
            });
    }catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
//@desc Get task by ID
//@route GET /api/tasks/:id
//@access Private/Admin/User
const getTaskById=async(req,res)=>{
    try{
        const task=await Task.findById(req.params.id).populate("assignedTo", "name email profileImageUrl");
        if(!task)
            return res.status(404).json({ message: "Task not found" });
        res.json(task);
    }catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
//@desc Create a new task
//@route POST /api/tasks
//@access Private/Admin
const createTask=async(req,res)=>{
    try{
        const { title, description, assignedTo, dueDate, priority,attachments,todoChecklist, } = req.body;
        if(!Array.isArray(assignedTo)){
            return res.status(400).json({ message: "AssignedTo must be an array of user IDs" });
        }
        
        const task = await Task.create({
            title,
            description,
            assignedTo,
            dueDate,
            priority,
            createdBy: req.user._id, // Assuming req.user contains the authenticated user
            attachments,
            todoChecklist
        });
        res.status(201).json({message: "Task created successfully", task });
    }catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
//@desc Update task by ID
//@route PUT /api/tasks/:id
//@access Private/Admin

const updateTask=async(req,res)=>{
    try{
        const task = await Task.findById(req.params.id);
        if(!task)
            return res.status(404).json({ message: "Task not found" });
        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
        task.attachments = req.body.attachments || task.attachments;
        if (req.body.assignedTo) {
            if (!Array.isArray(req.body.assignedTo)) {
                return res.status(400).json({ message: "AssignedTo must be an array of user IDs" });
            }
            task.assignedTo = req.body.assignedTo; // Update assignedTo if provided
        }
        
        const updatedTask = await task.save();
                    res.json({ message: "Task updated successfully",updatedTask });
    }catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
//@desc Delete task by ID
//@route DELETE /api/tasks/:id
//@access Private/Admin
const deleteTask=async(req,res)=>{
    try{
        const task = await Task.findById(req.params.id);
        if(!task)
            return res.status(404).json({ message: "Task not found" });
        
        await task.deleteOne(); // Delete the task
        res.json({ message: "Task deleted successfully" });
        
    }catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
//@desc Update task status by ID
//@route PUT /api/tasks/:id/status
//@access Private/Admin/User
const updateTaskStatus=async(req,res)=>{
    try{
        const task=await  Task.findById(req.params.id);
        if(!task)
            return res.status(404).json({ message: "Task not found" });
        const isAssigned=task.assignedTo.some(
            (userId)=>userId.toString()===req.user._id.toString()
        );
        if(!isAssigned && req.user.role!=='admin'){
            return res.status(403).json({ message: "not authorized" });
        }
        task.status=req.body.status || task.status;
        if(task.status ==='Completed'){
            task.todoChecklist.forEach((item) => (item.completed=true));
            task.progress=100;
        }
        await task.save();
        res.json({message:"task status updated",task});
       
    }catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
//@desc Update task checklist by ID
//@route PUT /api/tasks/:id/todo
//@access Private/Admin/User
const updateTaskChecklist=async(req,res)=>{
    try{
        const { todoChecklist } = req.body;
        const task = await Task.findById(req.params.id);
        if(!task)
            return res.status(404).json({ message: "Task not found" });
        if(!task.assignedTo.includes(req.user._id) && req.user.role!=='admin'){
         return res.status(403).json({ message: "not authorized" });
        }
        task.todoChecklist=todoChecklist;
        const completedCount=task.todoChecklist.filter((item)=>item.completed).length;
        const totalItems=task.todoChecklist.length;
        task.progress=totalItems > 0 ? ((completedCount / totalItems) * 100) : 0;

        if(task.progress===100){
            task.status='Completed'
        }
        else if(task.progress >0){
            task.status='In Progress'
        }else{
            task.status='Pending';
        }
        await task.save();
        const updatedTask=await Task.findById(req.params.id).populate("assignedTo","name email profileImageUrl");
        res.json({message:"task checklist updated",task:updatedTask});
    }catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//@desc Get dashboard data
//@route GET /api/tasks/dashboard-data
//@access Private/Admin
const getDashboardData = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: "Pending" });
        const inProgressTasks = await Task.countDocuments({ status: "In Progress" });
        const completedTasks = await Task.countDocuments({ status: "Completed" });
        const overDueTasks = await Task.countDocuments({ status: { $ne: "Completed"},
            dueDate: { $lt: new Date() },
        });

        //ensure all possibble status are included
        const taskStatuses= ["Pending","In Progress","Completed"];
        const tastDistributionRaw= await Task.aggregate([
            {
                $group:{
                    _id:"$status",
                    count: {$sum:1}

                },
            },
        ]);
        const taskDistribution=taskStatuses.reduce((acc,status)=>{
            const formattedKey= status.replace(/\s+/g,"");
            acc[formattedKey]=
            tastDistributionRaw.find(item=>
                item._id===status)?.count || 0;
                return acc;
            },{});
            taskDistribution["All"]=totalTasks;

            const taskPriorities=["Low","Medium","High"];
            const taskPriorityLevelsRaw = await Task.aggregate([
                {
                    $group:{
                        _id:"$priority",
                        count:{$sum:1},
                        },
                        },
                        ]);
            const taskPriorityLevels=taskPriorities.reduce((acc,priority)=>
                {
                    acc[priority] = taskPriorityLevelsRaw.find(item => item._id === priority)?.count || 0;
                    return acc;
                    }, {});
            const recentTasks=await Task.find().sort({createdAt:-1}).limit(10).select("title status priority dueDate");
            res.status(200).json({
                statistics: {
                    totalTasks,
                    pendingTasks,
                    completedTasks,
                    overDueTasks,
                },
                charts: {
                    taskDistribution,
                    taskPriorityLevels,
                },
                recentTasks,
            });


        

        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
//@desc Get user dashboard data
//@route GET /api/tasks/user-dashboard-data
//@access Private/User
const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming user ID is stored in req.user
        const totalTasks = await Task.countDocuments({ assignedTo: userId });
        const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "Pending" });
        const overDueTasks = await Task.countDocuments({ assignedTo: userId, status: {$ne: "Completed"}, dueDate: {$lt: new Date()} });
        const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "Completed" });
        const taskStatuses=["Pending","In Progress","Completed"];
        const taskDistributionRaw=await Task.aggregate ([{ $match:{assignedTo: userId}}, { $group: { _id:"$status",count:{$sum:1}}},
        ]);
        const taskDistribution=taskStatuses.reduce((acc,status)=>{
            const formattedKey=status.replace(/\s+/g,"");
            acc[formattedKey]=taskDistributionRaw.find((item)=> item._id===status)?.count || 0;
            return acc;
        },{});
        taskDistribution["All"]=totalTasks;
         const taskPriorities=["Low","Medium","High"];
         const taskPriorityLevelsRaw = await Task.aggregate([
             {
    $match: { assignedTo: userId }, // 👈 Only include user's tasks
  },
                {
                    $group:{
                        _id:"$priority",
                        count:{$sum:1},
                        },
                        },
                        ]);
            const taskPriorityLevels=taskPriorities.reduce((acc,priority)=>
                {
                    acc[priority] = taskPriorityLevelsRaw.find(item => item._id === priority)?.count || 0;
                    return acc;
                    }, {});
                     const recentTasks=await Task.find().sort({createdAt:-1}).limit(10).select("title status priority dueDate");
            res.status(200).json({
                statistics: {
                    totalTasks,
                    pendingTasks,
                    completedTasks,
                    overDueTasks,
                },
                charts: {
                    taskDistribution,
                    taskPriorityLevels,
                },
                recentTasks,
            });





        
    } catch (error) {
        console.error('Error in getUserDashboardData:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
module.exports={
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData

};