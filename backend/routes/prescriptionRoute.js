import express from "express";
import {
    createPrescription,
    getPrescriptionById,
    getPrescriptionsByPatient,
    getPrescriptionsByDoctor,
    updatePrescription,
    deletePrescription,
    getPrescriptionByAppointment
} from "../controllers/prescriptionController.js";
import authDoctor from "../middleware/authDoctor.js";
import authUser from "../middleware/authUser.js";

const router = express.Router();

// Doctor routes
router.post("/create", authDoctor, createPrescription);
router.get("/doctor/:doctorId", authDoctor, getPrescriptionsByDoctor);
router.put("/:id", authDoctor, updatePrescription);
router.delete("/:id", authDoctor, deletePrescription);
router.get("/appointment/:appointmentId", authDoctor, getPrescriptionByAppointment);

// Patient routes
router.get("/patient/:patientId", authUser, getPrescriptionsByPatient);
router.get("/:id", authUser, getPrescriptionById);

export default router;
