import chatbotModel from "../models/chatbotModel.js";
import diseaseModel from "../models/diseaseModel.js";

// Start new chat session
export const startChatSession = async (req, res) => {
    try {
        const { userId } = req.body;
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const newSession = new chatbotModel({
            userId,
            sessionId,
            date: Date.now()
        });

        await newSession.save();

        res.status(201).json({ 
            message: "Chat session started", 
            sessionId: newSession.sessionId,
            session: newSession
        });
    } catch (error) {
        console.error("Start chat session error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Send message to chatbot
export const sendMessage = async (req, res) => {
    try {
        const { sessionId, message } = req.body;

        const session = await chatbotModel.findOne({ sessionId, isActive: true });
        if (!session) {
            return res.status(404).json({ message: "Chat session not found" });
        }

        // Add user message to session
        session.messages.push({
            role: 'user',
            content: message,
            timestamp: new Date()
        });

        // Simple keyword-based response system
        const response = await generateResponse(message);
        
        // Add bot response to session
        session.messages.push({
            role: 'assistant',
            content: response.message,
            timestamp: new Date(),
            intent: response.intent,
            confidence: response.confidence,
            diseaseKeywords: response.diseaseKeywords,
            suggestedDiseases: response.suggestedDiseases
        });

        // Update user symptoms if detected
        if (response.symptoms && response.symptoms.length > 0) {
            session.userSymptoms = [...new Set([...session.userSymptoms, ...response.symptoms])];
        }

        // Update suggested diagnosis
        if (response.suggestedDiseases && response.suggestedDiseases.length > 0) {
            session.suggestedDiagnosis = [...new Set([...session.suggestedDiagnosis, ...response.suggestedDiseases])];
        }

        await session.save();

        res.json({ 
            message: "Message sent successfully", 
            response: response.message,
            session: session
        });
    } catch (error) {
        console.error("Send message error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Generate response based on user message
const generateResponse = async (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Common greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return {
            message: "Hello! I'm your health assistant. How can I help you today? You can describe your symptoms or ask me about any health concerns.",
            intent: 'greeting',
            confidence: 0.9
        };
    }

    // Symptom detection
    const symptoms = [];
    const diseaseKeywords = [];
    const suggestedDiseases = [];

    // Common symptoms mapping
    const symptomKeywords = {
        'fever': ['fever', 'temperature', 'hot', 'burning'],
        'headache': ['headache', 'head pain', 'migraine'],
        'cough': ['cough', 'coughing', 'dry cough', 'wet cough'],
        'cold': ['cold', 'runny nose', 'sneezing', 'congestion'],
        'fever': ['fever', 'temperature', 'hot', 'burning'],
        'headache': ['headache', 'head pain', 'migraine'],
        'cough': ['cough', 'coughing', 'dry cough', 'wet cough'],
        'cold': ['cold', 'runny nose', 'sneezing', 'congestion'],
        'sore throat': ['sore throat', 'throat pain', 'difficulty swallowing'],
        'body pain': ['body pain', 'muscle pain', 'joint pain', 'aches'],
        'fatigue': ['fatigue', 'tired', 'exhausted', 'weak'],
        'nausea': ['nausea', 'vomiting', 'sick', 'queasy'],
        'diarrhea': ['diarrhea', 'loose stools', 'stomach upset'],
        'chest pain': ['chest pain', 'chest discomfort', 'heart pain'],
        'shortness of breath': ['shortness of breath', 'breathing difficulty', 'dyspnea'],
        'dizziness': ['dizziness', 'lightheaded', 'vertigo'],
        'insomnia': ['insomnia', 'sleeplessness', 'can\'t sleep'],
        'anxiety': ['anxiety', 'worried', 'nervous', 'stress'],
        'depression': ['depression', 'sad', 'hopeless', 'mood']
    };

    // Check for symptoms in message
    for (const [symptom, keywords] of Object.entries(symptomKeywords)) {
        if (keywords.some(keyword => lowerMessage.includes(keyword))) {
            symptoms.push(symptom);
            diseaseKeywords.push(symptom);
        }
    }

    // If symptoms detected, search for potential diseases
    if (symptoms.length > 0) {
        const diseases = await diseaseModel.find({
            isActive: true,
            symptoms: { $in: symptoms }
        }).limit(3);

        diseases.forEach(disease => {
            suggestedDiseases.push(disease.name);
        });

        return {
            message: `I understand you're experiencing ${symptoms.join(', ')}. Based on your symptoms, you might want to consider consulting a doctor about: ${suggestedDiseases.join(', ')}. However, this is not a diagnosis - please consult a healthcare professional for proper medical advice.`,
            intent: 'symptom_analysis',
            confidence: 0.7,
            symptoms: symptoms,
            diseaseKeywords: diseaseKeywords,
            suggestedDiseases: suggestedDiseases
        };
    }

    // General health advice
    if (lowerMessage.includes('healthy') || lowerMessage.includes('diet') || lowerMessage.includes('exercise')) {
        return {
            message: "Maintaining good health involves a balanced diet, regular exercise, adequate sleep, and stress management. Remember to stay hydrated and get regular check-ups with your doctor.",
            intent: 'health_advice',
            confidence: 0.8
        };
    }

    // Emergency response
    if (lowerMessage.includes('emergency') || lowerMessage.includes('severe') || lowerMessage.includes('critical')) {
        return {
            message: "If you're experiencing a medical emergency, please call emergency services immediately (911 in the US) or go to the nearest emergency room. This chatbot is not a substitute for emergency medical care.",
            intent: 'emergency',
            confidence: 0.9
        };
    }

    // Default response
    return {
        message: "I'm here to help with your health concerns. Could you please describe your symptoms in more detail, or ask me a specific health-related question?",
        intent: 'general',
        confidence: 0.5
    };
};

// Get chat session
export const getChatSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await chatbotModel.findOne({ sessionId, isActive: true });
        
        if (!session) {
            return res.status(404).json({ message: "Chat session not found" });
        }

        res.json(session);
    } catch (error) {
        console.error("Get chat session error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Submit feedback
export const submitFeedback = async (req, res) => {
    try {
        const { sessionId, rating, helpful, comments } = req.body;

        const session = await chatbotModel.findOne({ sessionId, isActive: true });
        if (!session) {
            return res.status(404).json({ message: "Chat session not found" });
        }

        session.feedback = { rating, helpful, comments };
        session.endTime = new Date();
        await session.save();

        res.json({ message: "Feedback submitted successfully" });
    } catch (error) {
        console.error("Submit feedback error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get chatbot analytics
export const getChatbotAnalytics = async (req, res) => {
    try {
        const totalSessions = await chatbotModel.countDocuments({ isActive: true });
        const completedSessions = await chatbotModel.countDocuments({ 
            isActive: true, 
            'feedback.rating': { $exists: true } 
        });

        const averageRating = await chatbotModel.aggregate([
            { $match: { isActive: true, 'feedback.rating': { $exists: true } } },
            { $group: { _id: null, avgRating: { $avg: "$feedback.rating" } } }
        ]);

        const helpfulSessions = await chatbotModel.countDocuments({ 
            isActive: true, 
            'feedback.helpful': true 
        });

        res.json({
            totalSessions,
            completedSessions,
            averageRating: averageRating[0]?.avgRating || 0,
            helpfulSessions,
            helpfulRate: completedSessions > 0 ? (helpfulSessions / completedSessions) * 100 : 0
        });
    } catch (error) {
        console.error("Get chatbot analytics error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
