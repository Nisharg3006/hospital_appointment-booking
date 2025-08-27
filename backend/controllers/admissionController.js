import admissionModel from "../models/admissionModel.js";
import roomModel from "../models/roomModel.js";

// Create admission
export const createAdmission = async (req, res) => {
    try {
        const {
            patientId, doctorId, roomNumber, roomType, admissionDate,
            admissionTime, reason, diagnosis, dailyRate, notes
        } = req.body;

        // Check if room is available
        const room = await roomModel.findOne({ roomNumber, isActive: true });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        if (room.availableBeds <= 0) {
            return res.status(400).json({ message: "No available beds in this room" });
        }

        // Update room availability
        await roomModel.findByIdAndUpdate(room._id, {
            $inc: { occupiedBeds: 1, availableBeds: -1 }
        });

        const newAdmission = new admissionModel({
            patientId,
            doctorId,
            roomNumber,
            roomType,
            admissionDate,
            admissionTime,
            reason,
            diagnosis,
            dailyRate,
            notes,
            date: Date.now()
        });

        await newAdmission.save();

        res.status(201).json({ message: "Admission created successfully", admission: newAdmission });
    } catch (error) {
        console.error("Create admission error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get admission by ID
export const getAdmissionById = async (req, res) => {
    try {
        const { id } = req.params;
        const admission = await admissionModel.findById(id);
        
        if (!admission) {
            return res.status(404).json({ message: "Admission not found" });
        }

        res.json(admission);
    } catch (error) {
        console.error("Get admission by ID error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get admissions by patient ID
export const getAdmissionsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const admissions = await admissionModel.find({ 
            patientId, 
            isActive: true 
        }).sort({ date: -1 });

        res.json(admissions);
    } catch (error) {
        console.error("Get admissions by patient error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get current admissions
export const getCurrentAdmissions = async (req, res) => {
    try {
        const admissions = await admissionModel.find({ 
            status: 'admitted',
            isActive: true 
        }).sort({ date: -1 });

        res.json(admissions);
    } catch (error) {
        console.error("Get current admissions error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Discharge patient
export const dischargePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { dischargeDate, dischargeTime, dischargeSummary, followUpDate } = req.body;

        const admission = await admissionModel.findById(id);
        if (!admission) {
            return res.status(404).json({ message: "Admission not found" });
        }

        if (admission.status === 'discharged') {
            return res.status(400).json({ message: "Patient is already discharged" });
        }

        // Calculate total days and amount
        const admissionDate = new Date(admission.admissionDate);
        const dischargeDateObj = new Date(dischargeDate);
        const totalDays = Math.ceil((dischargeDateObj - admissionDate) / (1000 * 60 * 60 * 24));
        const totalAmount = totalDays * admission.dailyRate;

        // Update admission
        const updatedAdmission = await admissionModel.findByIdAndUpdate(
            id,
            {
                status: 'discharged',
                dischargeDate,
                dischargeTime,
                dischargeSummary,
                followUpDate,
                totalDays,
                totalAmount
            },
            { new: true }
        );

        // Update room availability
        await roomModel.findOneAndUpdate(
            { roomNumber: admission.roomNumber },
            {
                $inc: { occupiedBeds: -1, availableBeds: 1 }
            }
        );

        res.json({ message: "Patient discharged successfully", admission: updatedAdmission });
    } catch (error) {
        console.error("Discharge patient error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update admission
export const updateAdmission = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const admission = await admissionModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!admission) {
            return res.status(404).json({ message: "Admission not found" });
        }

        res.json({ message: "Admission updated successfully", admission });
    } catch (error) {
        console.error("Update admission error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get admission statistics
export const getAdmissionStats = async (req, res) => {
    try {
        const totalAdmissions = await admissionModel.countDocuments({ isActive: true });
        const currentAdmissions = await admissionModel.countDocuments({ 
            status: 'admitted', 
            isActive: true 
        });
        const dischargedAdmissions = await admissionModel.countDocuments({ 
            status: 'discharged', 
            isActive: true 
        });

        res.json({
            totalAdmissions,
            currentAdmissions,
            dischargedAdmissions
        });
    } catch (error) {
        console.error("Get admission stats error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
