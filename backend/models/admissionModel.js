import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema({
    patientId: { type: String, required: true },
    doctorId: { type: String, required: true },
    roomNumber: { type: String, required: true },
    roomType: { type: String, required: true, enum: ['general', 'semi_private', 'private', 'icu', 'emergency'] },
    admissionDate: { type: String, required: true },
    admissionTime: { type: String, required: true },
    dischargeDate: { type: String },
    dischargeTime: { type: String },
    reason: { type: String, required: true },
    diagnosis: { type: String, required: true },
    status: { type: String, required: true, enum: ['admitted', 'discharged', 'transferred'], default: 'admitted' },
    totalDays: { type: Number, default: 0 },
    dailyRate: { type: Number, required: true },
    totalAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ['pending', 'partial', 'completed'], default: 'pending' },
    notes: { type: String },
    dischargeSummary: { type: String },
    followUpDate: { type: String },
    isActive: { type: Boolean, default: true },
    date: { type: Number, required: true }
}, { minimize: false })

const admissionModel = mongoose.models.admission || mongoose.model("admission", admissionSchema);
export default admissionModel;
