import express from "express";
import {
  loginUser,
  registerUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
  paymentStripe,
  verifyStripe,
} from "../controllers/userController.js";
import upload from "../middleware/multer.js";
import authUser from "../middleware/authUser.js";

const userRouter = express.Router();

// Auth
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Profile
userRouter.get("/profile", authUser, getProfile);
userRouter.put("/profile", authUser, upload.single("image"), updateProfile);

// Appointments
userRouter.post("/appointments", authUser, bookAppointment); // book appointment
userRouter.get("/appointments", authUser, listAppointment); // list user appointments
userRouter.delete("/appointments/:id", authUser, cancelAppointment); // cancel appointment by id

// Legacy/alias endpoints used by frontend
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);

// Payments
userRouter.post("/payment/razorpay", authUser, paymentRazorpay);
userRouter.post("/payment/razorpay/verify", authUser, verifyRazorpay);
userRouter.post("/payment/stripe", authUser, paymentStripe);
userRouter.post("/payment/stripe/verify", authUser, verifyStripe);

// Legacy/alias payment endpoints used by frontend
userRouter.post("/payment-razorpay", authUser, paymentRazorpay);
userRouter.post("/verifyRazorpay", authUser, verifyRazorpay);
userRouter.post("/payment-stripe", authUser, paymentStripe);
userRouter.post("/verifyStripe", authUser, verifyStripe);

export default userRouter;
