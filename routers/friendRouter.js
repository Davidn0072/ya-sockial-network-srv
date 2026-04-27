import express from 'express';
import * as friendService from '../services/friendService.js';

const router = express.Router();

// Base URL: 'http://localhost:3000/friend'

router.post("/request", async (req, res) => {
    try {
        const fromUserId = req.user.id;
        const toUserId = req.body.toUserId;

        const result = await friendService.sendFriendRequest(fromUserId, toUserId);

        res.status(201).send(result);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.get("/requests", async (req, res) => {
    try {
        const userId = req.user.id;

        const data = await friendService.getRequestsByUserIdStatusRole(userId, "pending", "to", req.query);

        res.status(200).send(data);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.get("/rejected", async (req, res) => {
    try {
        const userId = req.user.id;

        const data = await friendService.getRequestsByUserIdStatusRole(userId, "rejected", "to", req.query);

        res.status(200).send(data);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.get("/accepted", async (req, res) => {
    try {
        const userId = req.user.id;

        const data = await friendService.getFriends(userId, req.query);

        res.status(200).send(data);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});


router.post("/accept", async (req, res) => {
    try {
        const userId = req.user.id;
        const requestId = req.body.requestId;

        const result = await friendService.acceptRequest(requestId, userId);

        res.status(200).send(result);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.post("/reject", async (req, res) => {
    try {
        const userId = req.user.id;
        const requestId = req.body.requestId;

        const result = await friendService.rejectRequest(requestId, userId);

        res.status(200).send(result);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const userId = req.user.id;
        const otherUserId = req.params.userId;
        const { id } = req.params;
        //console.log("deleteFriendRequest: " + id + " " + userId + " " + otherUserId);
        await friendService.deleteFriendRequest(id);

        res.status(200).send({ message: "Unfriended" });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

export default router;
