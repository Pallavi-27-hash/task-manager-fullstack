const express= require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { getDashboardData, getUserDashboardData, getTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist } = require("../controllers/taskController");
const  router= express.Router();


//task management routes
router.get("/dashboard-data",protect,getDashboardData); // Get dashboard data
router.get("/user-dashboard-data", protect, getUserDashboardData); // Get user dashboard data
router.get("/", protect, getTasks); // Get all tasks
router.get("/:id", protect, getTaskById); // Get task by ID
router.post("/", protect, adminOnly, createTask); // Create a new task admnin omnly
router.put("/:id", protect, updateTask); // Update task by ID
router.delete("/:id", protect,adminOnly, deleteTask); // Delete task by ID
router.put("/:id/status",protect,updateTaskStatus);
// Update task status by ID
router.put("/:id/todo",protect,updateTaskChecklist); // Update task checklist by ID


module.exports = router;