import express from 'express';
import * as friendService from '../services/friendService.js';
import { parseError } from '../errors/AppError.js';

const router = express.Router();

// Base URL: 'http://localhost:3000/friend'

router.post("/request", async (req, res) => {
    try {
        const fromUserId = req.user.id;
        const toUserId = req.body.toUserId;

        const result = await friendService.sendFriendRequest(fromUserId, toUserId);

        res.status(201).json(result);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

router.get("/requests", async (req, res) => {
    try {
        const userId = req.user.id;

        const data = await friendService.getRequestsByUserIdStatusRole(userId, "pending", "to", req.query);

        res.status(200).json(data);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

router.get("/rejected", async (req, res) => {
    try {
        const userId = req.user.id;

        const data = await friendService.getRequestsByUserIdStatusRole(userId, "rejected", "to", req.query);

        res.status(200).json(data);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

router.get("/accepted", async (req, res) => {
    try {
        const userId = req.user.id;

        const data = await friendService.getFriends(userId, req.query);

        res.status(200).json(data);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});


router.post("/accept", async (req, res) => {
    try {
        const userId = req.user.id;
        const requestId = req.body.requestId;

        const result = await friendService.acceptRequest(requestId, userId);

        res.status(200).json(result);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

router.post("/reject", async (req, res) => {
    try {
        const userId = req.user.id;
        const requestId = req.body.requestId;

        const result = await friendService.rejectRequest(requestId, userId);

        res.status(200).json(result);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        await friendService.deleteFriendRequest(id, userId);

        res.status(200).json({ message: "Unfriended" });
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

export default router;
