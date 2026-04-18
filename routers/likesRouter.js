import express from 'express';
import * as likesService from '../services/likesService.js';

const router = express.Router();

// Base URL: 'http://localhost:3000/likes'

// Get All Likes
router.get('/', async (req, res) => {
    try {
        //console.log('likeRouter-getAllLikes-req.query:', req.query);
        const queries = req.query
        const likes = await likesService.getAllLikes(queries);
        res.send(likes);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get likes by type
router.get('/by-type/:postId/:type', async (req, res) => {
    try {
        //console.log('getLikesByType-req.query:', req.params);
        const { postId, type } = req.params;
        //console.log('getLikesByType-postId:', postId);
        //console.log('getLikesByType-type:', type);
        const likes = await likesService.getLikesByType(postId, type);

        res.send(likes);

    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get By Id
router.get('/:id', async (req, res) => {
    try {
        //console.log('likeRouter-getLikeById-req.params:', req.params);
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
        const { postId, type } = req.body;
        const userId = req.user.id;
        //console.log("likeRouter-req.user:", req.user);
        //console.log("likeRouter-POST-userId:", userId + " postId: " + postId + " type: " + type);

        const result = await likesService.addOrUpdateReaction({
            userId,
            postId,
            type
        });

        res.send(result);
    } catch (error) {
        console.log("likeRouter-POST-error:", error);
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
