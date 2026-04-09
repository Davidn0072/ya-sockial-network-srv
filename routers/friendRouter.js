import express from 'express';
import * as friendService from '../services/friendService.js';

const router = express.Router();

// Base URL: 'http://localhost:3000/friends'

// Get All Friends
router.get('/', async (req, res) => {
    try {
        const queries = req.query
        const friends = await friendService.getAllFriends(queries);
        res.send(friends);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get By Id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const friend = await friendService.getFriendById(id);
        res.send(friend);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Add a new friend
router.post('/', async (req, res) => {
    try {
        const friendObj = req.body;
        const newFriend = await friendService.addFriend(friendObj);
        res.send(`The new ID: ${newFriend._id}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update a friend
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await friendService.updateFriend(id, data);
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete a friend
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await friendService.deleteFriend(id);
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;
