import express from "express";
import authAdmin from "../middleware/authAdmin.js";

import {
  loginAdmin,
  appointmentsAdmin,
  appointmentCancel,
  addDoctor,
  allDoctors,
  adminDashboard,
} from "../controllers/adminController.js";
import { changeAvailablity } from "../controllers/doctorController.js";


import upload from "../middleware/multer.js"; // ✅ make sure file is named upload.js

const adminRouter = express.Router();

// Admin login
adminRouter.post("/login", loginAdmin);

// Doctor management
adminRouter.post("/doctors", authAdmin, upload.single("image"), addDoctor);
adminRouter.get("/doctors", authAdmin, allDoctors);
adminRouter.post("/doctors/change-availability", authAdmin, changeAvailablity);

// Appointments management
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/appointments/cancel", authAdmin, appointmentCancel);

// Dashboard
adminRouter.get("/dashboard", authAdmin, adminDashboard);

export default adminRouter;
