import express from "express";
import {
    addRoom,
    getAllRooms,
    getRoomById,
    getAvailableRooms,
    updateRoom,
    setRoomMaintenance,
    deleteRoom,
    getRoomStats
} from "../controllers/roomController.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

// Admin routes
router.post("/add", authAdmin, addRoom);
router.get("/all", authAdmin, getAllRooms);
router.get("/available", authAdmin, getAvailableRooms);
router.get("/stats", authAdmin, getRoomStats);
router.get("/:id", authAdmin, getRoomById);
router.put("/:id", authAdmin, updateRoom);
router.put("/:id/maintenance", authAdmin, setRoomMaintenance);
router.delete("/:id", authAdmin, deleteRoom);

export default router;
