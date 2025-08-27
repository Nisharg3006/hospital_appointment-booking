import mongoose from "mongoose";

const chatbotSchema = new mongoose.Schema({
    userId: { type: String },
    sessionId: { type: String, required: true },
    messages: [{
        role: { type: String, required: true, enum: ['user', 'assistant'] },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        intent: { type: String },
        confidence: { type: Number },
        diseaseKeywords: [{ type: String }],
        suggestedDiseases: [{ type: String }]
    }],
    userSymptoms: [{ type: String }],
    suggestedDiagnosis: [{ type: String }],
    feedback: {
        rating: { type: Number, min: 1, max: 5 },
        helpful: { type: Boolean },
        comments: { type: String }
    },
    isActive: { type: Boolean, default: true },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    date: { type: Number, required: true }
}, { minimize: false })

const chatbotModel = mongoose.models.chatbot || mongoose.model("chatbot", chatbotSchema);
export default chatbotModel;
