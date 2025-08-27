import express from "express";
import {
    createBilling,
    getBillingById,
    getBillingsByPatient,
    updatePayment,
    getPendingPayments,
    getBillingStats,
    deleteBilling
} from "../controllers/billingController.js";
import authAdmin from "../middleware/authAdmin.js";
import authUser from "../middleware/authUser.js";
import authDoctor from "../middleware/authDoctor.js";

const router = express.Router();

// Admin routes
router.post("/create", authAdmin, createBilling);
router.get("/pending", authAdmin, getPendingPayments);
router.get("/stats", authAdmin, getBillingStats);
router.delete("/:id", authAdmin, deleteBilling);

// Patient routes
router.get("/patient/:patientId", authUser, getBillingsByPatient);
router.get("/:id", authUser, getBillingById);
router.put("/:id/payment", authUser, updatePayment);

// Doctor routes (for viewing patient bills)
router.get("/patient/:patientId", authDoctor, getBillingsByPatient);

export default router;
