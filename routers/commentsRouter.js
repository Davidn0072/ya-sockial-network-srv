import express from 'express';
import * as commentsService from '../services/commentsService.js';
import { parseError } from '../errors/AppError.js';

const router = express.Router();

// Base URL: 'http://localhost:3000/comments'

// Get All
router.get('/', async (req, res) => {
    try {
        //console.log("getAllComments req.query:" + JSON.stringify(req.query));
        const { postId, parentCommentId, cursor, limit } = req.query;
        //console.log("getAllComments postId:" + postId + " parentCommentId:" + parentCommentId + " cursor:" + cursor + " limit:" + limit);
        if (postId) {
            const result = await commentsService.getAllCommentsPaged({
                postId,
                parentCommentId: parentCommentId ?? null,
                cursor: cursor || null,
                limit: limit ? Number(limit) : 10
            });
            return res.json(result);
        }
        const comments = await commentsService.getAllComments(req.query);
        res.status(200).json(comments);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

// Get By Id
router.get('/:id', async (req, res) => {
    try {
        //console.log("getCommentById req.params:" + JSON.stringify(req.params));
        const { id } = req.params;
        // console.log("getCommentById id:" + id);
        const comment = await commentsService.getCommentById(id);
        res.status(200).json(comment);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

// Add a new comment
router.post('/', async (req, res) => {
    try {
        const commentObj = req.body;
        const newComment = await commentsService.addComment(commentObj);
        res.status(201).json({ message: `The new ID: ${newComment._id}` });
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

// Update a comment
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await commentsService.updateComment(id, data);
        res.status(200).json(result);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

// Delete a comment
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await commentsService.deleteComment(id);
        res.status(200).json(result);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

export default router;
