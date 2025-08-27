import express from "express";
import {
    createAdmission,
    getAdmissionById,
    getAdmissionsByPatient,
    getCurrentAdmissions,
    dischargePatient,
    updateAdmission,
    getAdmissionStats
} from "../controllers/admissionController.js";
import authDoctor from "../middleware/authDoctor.js";
import authUser from "../middleware/authUser.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

// Doctor routes
router.post("/create", authDoctor, createAdmission);
router.get("/doctor/current", authDoctor, getCurrentAdmissions);
router.put("/:id/discharge", authDoctor, dischargePatient);
router.put("/:id", authDoctor, updateAdmission);

// Patient routes
router.get("/patient/:patientId", authUser, getAdmissionsByPatient);
router.get("/:id", authUser, getAdmissionById);

// Admin routes
router.get("/stats/overview", authAdmin, getAdmissionStats);

export default router;
