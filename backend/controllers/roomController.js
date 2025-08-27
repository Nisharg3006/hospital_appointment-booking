import roomModel from "../models/roomModel.js";

// Add new room
export const addRoom = async (req, res) => {
    try {
        const {
            roomNumber, roomType, floor, ward, capacity,
            dailyRate, amenities, notes
        } = req.body;

        // Check if room already exists
        const existingRoom = await roomModel.findOne({ roomNumber });
        if (existingRoom) {
            return res.status(400).json({ message: "Room with this number already exists" });
        }

        const newRoom = new roomModel({
            roomNumber,
            roomType,
            floor,
            ward,
            capacity,
            availableBeds: capacity,
            dailyRate,
            amenities,
            notes,
            date: Date.now()
        });

        await newRoom.save();

        res.status(201).json({ message: "Room added successfully", room: newRoom });
    } catch (error) {
        console.error("Add room error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all rooms
export const getAllRooms = async (req, res) => {
    try {
        const rooms = await roomModel.find({ isActive: true });
        res.json(rooms);
    } catch (error) {
        console.error("Get all rooms error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get room by ID
export const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await roomModel.findById(id);
        
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.json(room);
    } catch (error) {
        console.error("Get room by ID error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get available rooms
export const getAvailableRooms = async (req, res) => {
    try {
        const { roomType } = req.query;
        let query = { isActive: true, availableBeds: { $gt: 0 }, isMaintenance: false };
        
        if (roomType) {
            query.roomType = roomType;
        }

        const rooms = await roomModel.find(query);
        res.json(rooms);
    } catch (error) {
        console.error("Get available rooms error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update room
export const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const room = await roomModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.json({ message: "Room updated successfully", room });
    } catch (error) {
        console.error("Update room error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Set room maintenance
export const setRoomMaintenance = async (req, res) => {
    try {
        const { id } = req.params;
        const { isMaintenance, maintenanceReason, maintenanceStartDate, maintenanceEndDate } = req.body;

        const room = await roomModel.findByIdAndUpdate(
            id,
            {
                isMaintenance,
                maintenanceReason,
                maintenanceStartDate,
                maintenanceEndDate
            },
            { new: true }
        );

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.json({ message: "Room maintenance status updated successfully", room });
    } catch (error) {
        console.error("Set room maintenance error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete room (soft delete)
export const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await roomModel.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.json({ message: "Room deleted successfully" });
    } catch (error) {
        console.error("Delete room error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get room statistics
export const getRoomStats = async (req, res) => {
    try {
        const totalRooms = await roomModel.countDocuments({ isActive: true });
        const availableRooms = await roomModel.countDocuments({ 
            isActive: true, 
            availableBeds: { $gt: 0 },
            isMaintenance: false
        });
        const maintenanceRooms = await roomModel.countDocuments({ 
            isActive: true, 
            isMaintenance: true 
        });

        const roomTypes = await roomModel.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: "$roomType", count: { $sum: 1 } } }
        ]);

        res.json({
            totalRooms,
            availableRooms,
            maintenanceRooms,
            roomTypes
        });
    } catch (error) {
        console.error("Get room stats error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
