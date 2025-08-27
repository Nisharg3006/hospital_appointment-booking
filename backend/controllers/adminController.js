import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";
import staffModel from "../models/staffModel.js";
import admissionModel from "../models/admissionModel.js";
import billingModel from "../models/billingModel.js";
import roomModel from "../models/roomModel.js";
import chatbotModel from "../models/chatbotModel.js";

// API for admin login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}


// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for adding Doctor
const addDoctor = async (req, res) => {

    try {

        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        // validate image & cloudinary configuration
        if (!imageFile) {
            return res.json({ success: false, message: "Doctor image is required" })
        }
        if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
            return res.json({ success: false, message: "Cloudinary is not configured. Please set CLOUDINARY_* env vars." })
        }

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        res.json({ success: true, message: 'Doctor Added' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})
        const staff = await staffModel.find({ isActive: true })
        const admissions = await admissionModel.find({ isActive: true })
        const currentAdmissions = await admissionModel.find({ status: 'admitted', isActive: true })
        const billings = await billingModel.find({ isActive: true })
        const rooms = await roomModel.find({ isActive: true })
        const availableRooms = await roomModel.find({ isActive: true, availableBeds: { $gt: 0 } })
        const chatbotSessions = await chatbotModel.find({ isActive: true })

        // Calculate revenue
        const totalRevenue = await billingModel.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        const paidRevenue = await billingModel.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: null, total: { $sum: "$paidAmount" } } }
        ]);

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            staff: staff.length,
            admissions: admissions.length,
            currentAdmissions: currentAdmissions.length,
            totalRevenue: totalRevenue[0]?.total || 0,
            paidRevenue: paidRevenue[0]?.total || 0,
            pendingRevenue: (totalRevenue[0]?.total || 0) - (paidRevenue[0]?.total || 0),
            totalRooms: rooms.length,
            availableRooms: availableRooms.length,
            chatbotSessions: chatbotSessions.length,
            latestAppointments: appointments.reverse().slice(0, 10),
            latestAdmissions: admissions.reverse().slice(0, 5)
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addDoctor,
    allDoctors,
    adminDashboard
}