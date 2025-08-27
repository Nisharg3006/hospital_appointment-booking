import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    appointmentId: { type: String, required: true },
    patientId: { type: String, required: true },
    doctorId: { type: String, required: true },
    diagnosis: { type: String, required: true },
    symptoms: [{ type: String }],
    medicines: [{
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true },
        instructions: { type: String },
        beforeMeal: { type: Boolean, default: false }
    }],
    tests: [{
        name: { type: String, required: true },
        description: { type: String },
        isRequired: { type: Boolean, default: true }
    }],
    followUpDate: { type: String },
    followUpInstructions: { type: String },
    lifestyleAdvice: [{ type: String }],
    notes: { type: String },
    isActive: { type: Boolean, default: true },
    date: { type: Number, required: true }
}, { minimize: false })

const prescriptionModel = mongoose.models.prescription || mongoose.model("prescription", prescriptionSchema);
export default prescriptionModel;
