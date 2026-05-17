import express from 'express';
import * as likesService from '../services/likesService.js';
import { parseError } from '../errors/AppError.js';

const router = express.Router();

// Base URL: 'http://localhost:3000/likes'

// Get likes by type with reaction type (more specific - must be before /by-type/:targetId)
router.get('/by-type/:targetId/:type', async (req, res) => {
    try {
        const { targetId, type } = req.params;
        const params = {
            ...req.query,
            postId: targetId,
            reactionType: type
        };
        //console.log("LikesRouter-GET-by-type-1-targetId:", targetId);
        //console.log("LikesRouter-GET-by-type-1-type:", type);
        //console.log("LikesRouter-GET-by-type-1-req.query:", JSON.stringify(req.query, null, 2));
        //console.log("LikesRouter-GET-by-type-1-req.params:", JSON.stringify(req.params, null, 2));
        const likes = await likesService.getLikesByType(params);
        res.status(200).json(likes);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

// Get likes by type
router.get('/by-type/:targetId', async (req, res) => {
    try {
        const { targetId } = req.params;
        const params = {
            ...req.query,
            postId: targetId
        };
        //console.log("LikesRouter-GET-by-type-0-targetId:", targetId);
        //console.log("LikesRouter-GET-by-type-0-req.query:", JSON.stringify(req.query, null, 2));
        //console.log("LikesRouter-GET-by-type-0-req.params:", JSON.stringify(req.params, null, 2));
        const likes = await likesService.getLikesByType(params);
        res.status(200).json(likes);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

// Get likes stats (grouped by reaction type)
router.get('/:targetId/stats', async (req, res) => {
    try {
        const { targetId } = req.params;
        const { targetType = 'post' } = req.query;
        const stats = await likesService.getAllLikesGroupByType({
            targetId: targetId,
            targetType: targetType
        });
        res.status(200).json(stats);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

// Get By Id
router.get('/:id', async (req, res) => {
    try {
        //console.log('likeRouter-getLikeById-req.params:', req.params);
        const { id } = req.params;
        const like = await likesService.getLikeById(id);
        res.status(200).json(like);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

// Add a new like
router.post('/', async (req, res) => {
    try {
        //console.log("LikesRouter-POST-body:", req.body);

        const { targetId, targetType, type } = req.body;
        const userId = req.user.id;

        const result = await likesService.addOrUpdateReaction({
            userId,
            targetId,
            targetType,
            type
        });

        res.status(200).json(result);

    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

// Update a like
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await likesService.updateLike(id, data, req.user.id);
        res.status(200).json(result);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

// Delete a like
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await likesService.deleteLike(id, req.user.id);
        res.status(200).json(result);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

export default router;
