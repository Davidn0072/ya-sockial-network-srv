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
router.get('/by-type/:targetId', async (req, res) => {
    try {
        const { targetId } = req.params;
        const likes = await likesService.getLikesByType({ targetId });
        res.send(likes);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/by-type/:targetId/:type', async (req, res) => {
    try {
        const { targetId, type } = req.params;
        const likes = await likesService.getLikesByType({ targetId, type });
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
        console.log("LikesRouter-POST-body:", req.body);

        const { targetId, targetType, type } = req.body;
        const userId = req.user.id;

        const result = await likesService.addOrUpdateReaction({
            userId,
            targetId,
            targetType,
            type
        });

        res.send(result);

    } catch (error) {
        console.log("likeRouter-error:", error);
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
