const express=require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const { exportTasksReport, exportUsersReport } = require("../controllers/reportController");
const router=express.Router();

router.get("/export/tasks",protect,adminOnly,exportTasksReport); //export all tasks as excel
router.get("/export/users",protect,adminOnly,exportUsersReport); //export user-task report



module.exports=router;
