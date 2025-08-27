import billingModel from "../models/billingModel.js";
import appointmentModel from "../models/appointmentModel.js";
import admissionModel from "../models/admissionModel.js";

// Generate bill number
const generateBillNumber = () => {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `BILL-${timestamp.slice(-6)}-${random}`;
};

// Create billing
export const createBilling = async (req, res) => {
    try {
        const {
            patientId, appointmentId, admissionId, billType, items,
            subtotal, tax, discount, totalAmount, dueDate, notes
        } = req.body;

        // Validate bill type and related IDs
        if (billType === 'appointment' && !appointmentId) {
            return res.status(400).json({ message: "Appointment ID required for appointment billing" });
        }

        if (billType === 'admission' && !admissionId) {
            return res.status(400).json({ message: "Admission ID required for admission billing" });
        }

        const newBilling = new billingModel({
            patientId,
            appointmentId,
            admissionId,
            billType,
            items,
            subtotal,
            tax,
            discount,
            totalAmount,
            balanceAmount: totalAmount,
            dueDate,
            billDate: new Date().toISOString().split('T')[0],
            billNumber: generateBillNumber(),
            notes,
            date: Date.now()
        });

        await newBilling.save();

        res.status(201).json({ message: "Billing created successfully", billing: newBilling });
    } catch (error) {
        console.error("Create billing error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get billing by ID
export const getBillingById = async (req, res) => {
    try {
        const { id } = req.params;
        const billing = await billingModel.findById(id);
        
        if (!billing) {
            return res.status(404).json({ message: "Billing not found" });
        }

        res.json(billing);
    } catch (error) {
        console.error("Get billing by ID error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get billings by patient ID
export const getBillingsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const billings = await billingModel.find({ 
            patientId, 
            isActive: true 
        }).sort({ date: -1 });

        res.json(billings);
    } catch (error) {
        console.error("Get billings by patient error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update payment
export const updatePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { paidAmount, paymentMethod } = req.body;

        const billing = await billingModel.findById(id);
        if (!billing) {
            return res.status(404).json({ message: "Billing not found" });
        }

        const newPaidAmount = billing.paidAmount + paidAmount;
        const newBalanceAmount = billing.totalAmount - newPaidAmount;
        const paymentStatus = newBalanceAmount <= 0 ? 'completed' : 
                            newPaidAmount > 0 ? 'partial' : 'pending';

        const updatedBilling = await billingModel.findByIdAndUpdate(
            id,
            {
                paidAmount: newPaidAmount,
                balanceAmount: newBalanceAmount,
                paymentMethod,
                paymentStatus
            },
            { new: true }
        );

        res.json({ message: "Payment updated successfully", billing: updatedBilling });
    } catch (error) {
        console.error("Update payment error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get pending payments
export const getPendingPayments = async (req, res) => {
    try {
        const billings = await billingModel.find({ 
            paymentStatus: { $in: ['pending', 'partial'] },
            isActive: true 
        }).sort({ dueDate: 1 });

        res.json(billings);
    } catch (error) {
        console.error("Get pending payments error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get billing statistics
export const getBillingStats = async (req, res) => {
    try {
        const totalBills = await billingModel.countDocuments({ isActive: true });
        const totalAmount = await billingModel.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const totalPaid = await billingModel.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: null, total: { $sum: "$paidAmount" } } }
        ]);
        const pendingBills = await billingModel.countDocuments({ 
            paymentStatus: { $in: ['pending', 'partial'] },
            isActive: true 
        });

        res.json({
            totalBills,
            totalAmount: totalAmount[0]?.total || 0,
            totalPaid: totalPaid[0]?.total || 0,
            pendingBills
        });
    } catch (error) {
        console.error("Get billing stats error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete billing (soft delete)
export const deleteBilling = async (req, res) => {
    try {
        const { id } = req.params;
        const billing = await billingModel.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!billing) {
            return res.status(404).json({ message: "Billing not found" });
        }

        res.json({ message: "Billing deleted successfully" });
    } catch (error) {
        console.error("Delete billing error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
