import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"
import staffRouter from "./routes/staffRoute.js"
import diseaseRouter from "./routes/diseaseRoute.js"
import prescriptionRouter from "./routes/prescriptionRoute.js"
import admissionRouter from "./routes/admissionRoute.js"
import billingRouter from "./routes/billingRoute.js"
import roomRouter from "./routes/roomRoute.js"
import chatbotRouter from "./routes/chatbotRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)
app.use("/api/staff", staffRouter)
app.use("/api/disease", diseaseRouter)
app.use("/api/prescription", prescriptionRouter)
app.use("/api/admission", admissionRouter)
app.use("/api/billing", billingRouter)
app.use("/api/room", roomRouter)
app.use("/api/chatbot", chatbotRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

app.listen(port, () => console.log(`Server started on PORT:${port}`))