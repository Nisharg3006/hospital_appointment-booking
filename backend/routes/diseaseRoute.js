import express from "express";
import {
    addDisease,
    getAllDiseases,
    getDiseaseById,
    updateDisease,
    deleteDisease,
    getDiseasesByCategory,
    searchDiseasesBySymptoms,
    getChatbotTrainingData
} from "../controllers/diseaseController.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

// Admin routes
router.post("/add", authAdmin, addDisease);
router.get("/all", authAdmin, getAllDiseases);
router.get("/:id", authAdmin, getDiseaseById);
router.put("/:id", authAdmin, updateDisease);
router.delete("/:id", authAdmin, deleteDisease);
router.get("/category/:category", authAdmin, getDiseasesByCategory);
router.post("/search-symptoms", authAdmin, searchDiseasesBySymptoms);
router.get("/chatbot/training-data", authAdmin, getChatbotTrainingData);

export default router;
