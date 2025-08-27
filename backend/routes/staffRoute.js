import express from "express";
import {
    registerStaff,
    staffLogin,
    getAllStaff,
    getStaffById,
    updateStaff,
    deleteStaff,
    getStaffByDepartment
} from "../controllers/staffController.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

// Public routes
router.post("/register", authAdmin, registerStaff);
router.post("/login", staffLogin);

// Protected routes (admin only)
router.get("/all", authAdmin, getAllStaff);
router.get("/:id", authAdmin, getStaffById);
router.put("/:id", authAdmin, updateStaff);
router.delete("/:id", authAdmin, deleteStaff);
router.get("/department/:department", authAdmin, getStaffByDepartment);

export default router;
