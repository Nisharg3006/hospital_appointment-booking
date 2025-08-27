import mongoose from "mongoose";

const billingSchema = new mongoose.Schema({
    patientId: { type: String, required: true },
    appointmentId: { type: String },
    admissionId: { type: String },
    billType: { type: String, required: true, enum: ['appointment', 'admission', 'medicine', 'test', 'procedure', 'consultation'] },
    items: [{
        name: { type: String, required: true },
        description: { type: String },
        quantity: { type: Number, required: true, default: 1 },
        unitPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true }
    }],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    balanceAmount: { type: Number, default: 0 },
    paymentMethod: { type: String, enum: ['cash', 'card', 'upi', 'insurance', 'pending'] },
    paymentStatus: { type: String, enum: ['pending', 'partial', 'completed'], default: 'pending' },
    dueDate: { type: String },
    billDate: { type: String, required: true },
    billNumber: { type: String, required: true, unique: true },
    notes: { type: String },
    isActive: { type: Boolean, default: true },
    date: { type: Number, required: true }
}, { minimize: false })

const billingModel = mongoose.models.billing || mongoose.model("billing", billingSchema);
export default billingModel;
