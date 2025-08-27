import express from "express";
import {
    startChatSession,
    sendMessage,
    getChatSession,
    submitFeedback,
    getChatbotAnalytics
} from "../controllers/chatbotController.js";
import authUser from "../middleware/authUser.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

// Public routes (no auth required for basic chat)
router.post("/session/start", startChatSession);
router.post("/message", sendMessage);
router.get("/session/:sessionId", getChatSession);
router.post("/feedback", submitFeedback);

// Admin routes
router.get("/analytics", authAdmin, getChatbotAnalytics);

export default router;
