import staffModel from "../models/staffModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register new staff
export const registerStaff = async (req, res) => {
    try {
        const { name, email, password, phone, role, department, address, salary } = req.body;

        // Check if staff already exists
        const existingStaff = await staffModel.findOne({ email });
        if (existingStaff) {
            return res.status(400).json({ message: "Staff with this email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new staff
        const newStaff = new staffModel({
            name,
            email,
            password: hashedPassword,
            phone,
            role,
            department,
            address,
            salary,
            date: Date.now()
        });

        await newStaff.save();

        res.status(201).json({ message: "Staff registered successfully" });
    } catch (error) {
        console.error("Staff registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Staff login
export const staffLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find staff
        const staff = await staffModel.findOne({ email });
        if (!staff) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, staff.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign(
            { id: staff._id, email: staff.email, role: staff.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            staff: {
                id: staff._id,
                name: staff.name,
                email: staff.email,
                role: staff.role,
                department: staff.department
            }
        });
    } catch (error) {
        console.error("Staff login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all staff
export const getAllStaff = async (req, res) => {
    try {
        const staff = await staffModel.find({ isActive: true }).select('-password');
        res.json(staff);
    } catch (error) {
        console.error("Get all staff error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get staff by ID
export const getStaffById = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await staffModel.findById(id).select('-password');
        
        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }

        res.json(staff);
    } catch (error) {
        console.error("Get staff by ID error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update staff
export const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // If password is being updated, hash it
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const staff = await staffModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).select('-password');

        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }

        res.json({ message: "Staff updated successfully", staff });
    } catch (error) {
        console.error("Update staff error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete staff (soft delete)
export const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await staffModel.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }

        res.json({ message: "Staff deleted successfully" });
    } catch (error) {
        console.error("Delete staff error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get staff by department
export const getStaffByDepartment = async (req, res) => {
    try {
        const { department } = req.params;
        const staff = await staffModel.find({ 
            department, 
            isActive: true 
        }).select('-password');

        res.json(staff);
    } catch (error) {
        console.error("Get staff by department error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
