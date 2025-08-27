import diseaseModel from "../models/diseaseModel.js";

// Add new disease
export const addDisease = async (req, res) => {
    try {
        const {
            name, description, symptoms, causes, treatments, prevention,
            category, severity, contagious, ageGroup, gender, riskFactors,
            complications, diagnosticTests, medications, lifestyleChanges,
            chatbotKeywords, chatbotResponses
        } = req.body;

        // Check if disease already exists
        const existingDisease = await diseaseModel.findOne({ name });
        if (existingDisease) {
            return res.status(400).json({ message: "Disease with this name already exists" });
        }

        const newDisease = new diseaseModel({
            name,
            description,
            symptoms,
            causes,
            treatments,
            prevention,
            category,
            severity,
            contagious,
            ageGroup,
            gender,
            riskFactors,
            complications,
            diagnosticTests,
            medications,
            lifestyleChanges,
            chatbotKeywords,
            chatbotResponses,
            createdBy: req.user.id,
            date: Date.now()
        });

        await newDisease.save();

        res.status(201).json({ message: "Disease added successfully", disease: newDisease });
    } catch (error) {
        console.error("Add disease error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all diseases
export const getAllDiseases = async (req, res) => {
    try {
        const diseases = await diseaseModel.find({ isActive: true });
        res.json(diseases);
    } catch (error) {
        console.error("Get all diseases error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get disease by ID
export const getDiseaseById = async (req, res) => {
    try {
        const { id } = req.params;
        const disease = await diseaseModel.findById(id);
        
        if (!disease) {
            return res.status(404).json({ message: "Disease not found" });
        }

        res.json(disease);
    } catch (error) {
        console.error("Get disease by ID error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update disease
export const updateDisease = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body, updatedBy: req.user.id };

        const disease = await diseaseModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!disease) {
            return res.status(404).json({ message: "Disease not found" });
        }

        res.json({ message: "Disease updated successfully", disease });
    } catch (error) {
        console.error("Update disease error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete disease (soft delete)
export const deleteDisease = async (req, res) => {
    try {
        const { id } = req.params;
        const disease = await diseaseModel.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!disease) {
            return res.status(404).json({ message: "Disease not found" });
        }

        res.json({ message: "Disease deleted successfully" });
    } catch (error) {
        console.error("Delete disease error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get diseases by category
export const getDiseasesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const diseases = await diseaseModel.find({ 
            category, 
            isActive: true 
        });

        res.json(diseases);
    } catch (error) {
        console.error("Get diseases by category error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Search diseases by symptoms (for chatbot)
export const searchDiseasesBySymptoms = async (req, res) => {
    try {
        const { symptoms } = req.body;
        
        if (!symptoms || !Array.isArray(symptoms)) {
            return res.status(400).json({ message: "Symptoms array is required" });
        }

        // Find diseases that match any of the provided symptoms
        const diseases = await diseaseModel.find({
            isActive: true,
            symptoms: { $in: symptoms }
        });

        res.json(diseases);
    } catch (error) {
        console.error("Search diseases by symptoms error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get chatbot training data
export const getChatbotTrainingData = async (req, res) => {
    try {
        const diseases = await diseaseModel.find({ 
            isActive: true 
        }).select('name symptoms chatbotKeywords chatbotResponses category severity');

        res.json(diseases);
    } catch (error) {
        console.error("Get chatbot training data error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
