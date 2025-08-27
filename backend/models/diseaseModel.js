import mongoose from "mongoose";

const diseaseSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    symptoms: [{ type: String, required: true }],
    causes: [{ type: String }],
    treatments: [{ type: String }],
    prevention: [{ type: String }],
    category: { type: String, required: true, enum: ['infectious', 'chronic', 'genetic', 'autoimmune', 'cancer', 'mental_health', 'cardiovascular', 'respiratory', 'digestive', 'neurological', 'other'] },
    severity: { type: String, required: true, enum: ['low', 'medium', 'high', 'critical'] },
    contagious: { type: Boolean, default: false },
    ageGroup: [{ type: String, enum: ['infant', 'child', 'teen', 'adult', 'elderly'] }],
    gender: [{ type: String, enum: ['male', 'female', 'all'] }],
    riskFactors: [{ type: String }],
    complications: [{ type: String }],
    diagnosticTests: [{ type: String }],
    medications: [{ type: String }],
    lifestyleChanges: [{ type: String }],
    chatbotKeywords: [{ type: String }],
    chatbotResponses: [{ type: String }],
    isActive: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    updatedBy: { type: String },
    date: { type: Number, required: true }
}, { minimize: false })

const diseaseModel = mongoose.models.disease || mongoose.model("disease", diseaseSchema);
export default diseaseModel;
