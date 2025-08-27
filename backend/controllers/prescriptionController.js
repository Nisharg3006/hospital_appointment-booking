import prescriptionModel from "../models/prescriptionModel.js";
import appointmentModel from "../models/appointmentModel.js";

// Create prescription
export const createPrescription = async (req, res) => {
    try {
        const {
            appointmentId, patientId, doctorId, diagnosis, symptoms,
            medicines, tests, followUpDate, followUpInstructions,
            lifestyleAdvice, notes
        } = req.body;

        // Check if appointment exists and is completed
        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (!appointment.isCompleted) {
            return res.status(400).json({ message: "Appointment must be completed before creating prescription" });
        }

        const newPrescription = new prescriptionModel({
            appointmentId,
            patientId,
            doctorId,
            diagnosis,
            symptoms,
            medicines,
            tests,
            followUpDate,
            followUpInstructions,
            lifestyleAdvice,
            notes,
            date: Date.now()
        });

        await newPrescription.save();

        res.status(201).json({ message: "Prescription created successfully", prescription: newPrescription });
    } catch (error) {
        console.error("Create prescription error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get prescription by ID
export const getPrescriptionById = async (req, res) => {
    try {
        const { id } = req.params;
        const prescription = await prescriptionModel.findById(id);
        
        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found" });
        }

        res.json(prescription);
    } catch (error) {
        console.error("Get prescription by ID error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get prescriptions by patient ID
export const getPrescriptionsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const prescriptions = await prescriptionModel.find({ 
            patientId, 
            isActive: true 
        }).sort({ date: -1 });

        res.json(prescriptions);
    } catch (error) {
        console.error("Get prescriptions by patient error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get prescriptions by doctor ID
export const getPrescriptionsByDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const prescriptions = await prescriptionModel.find({ 
            doctorId, 
            isActive: true 
        }).sort({ date: -1 });

        res.json(prescriptions);
    } catch (error) {
        console.error("Get prescriptions by doctor error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update prescription
export const updatePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const prescription = await prescriptionModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found" });
        }

        res.json({ message: "Prescription updated successfully", prescription });
    } catch (error) {
        console.error("Update prescription error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete prescription (soft delete)
export const deletePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        const prescription = await prescriptionModel.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found" });
        }

        res.json({ message: "Prescription deleted successfully" });
    } catch (error) {
        console.error("Delete prescription error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get prescription by appointment ID
export const getPrescriptionByAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const prescription = await prescriptionModel.findOne({ 
            appointmentId, 
            isActive: true 
        });

        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found for this appointment" });
        }

        res.json(prescription);
    } catch (error) {
        console.error("Get prescription by appointment error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
