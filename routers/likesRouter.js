import express from 'express';
import * as likesService from '../services/likesService.js';

const router = express.Router();

// Base URL: 'http://localhost:3000/likes'

// Get All Likes
router.get('/', async (req, res) => {
    try {
        const queries = req.query
        const likes = await likesService.getAllLikes(queries);
        res.send(likes);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get By Id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const like = await likesService.getLikeById(id);
        res.send(like);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Add a new like
router.post('/', async (req, res) => {
    try {
        const likeObj = req.body;
        const newLike = await likesService.addLike(likeObj);
        res.send(`The new ID: ${newLike._id}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update a like
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await likesService.updateLike(id, data);
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete a like
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await likesService.deleteLike(id);
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;
