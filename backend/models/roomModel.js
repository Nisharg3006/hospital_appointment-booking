import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true, unique: true },
    roomType: { type: String, required: true, enum: ['general', 'semi_private', 'private', 'icu', 'emergency'] },
    floor: { type: String, required: true },
    ward: { type: String, required: true },
    capacity: { type: Number, required: true, default: 1 },
    occupiedBeds: { type: Number, default: 0 },
    availableBeds: { type: Number, default: 1 },
    dailyRate: { type: Number, required: true },
    amenities: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isMaintenance: { type: Boolean, default: false },
    maintenanceReason: { type: String },
    maintenanceStartDate: { type: String },
    maintenanceEndDate: { type: String },
    notes: { type: String },
    date: { type: Number, required: true }
}, { minimize: false })

const roomModel = mongoose.models.room || mongoose.model("room", roomSchema);
export default roomModel;
