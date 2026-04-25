import express from 'express';
import * as commentsService from '../services/commentsService.js';

const router = express.Router();

// Base URL: 'http://localhost:3000/persons'

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
        res.send(comments);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get By Id
router.get('/:id', async (req, res) => {
    try {
        //console.log("getCommentById req.params:" + JSON.stringify(req.params));
        const { id } = req.params;
        // console.log("getCommentById id:" + id);
        const comment = await commentsService.getCommentById(id);
        res.send(comment);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Add a new person
router.post('/', async (req, res) => {
    try {
        const commentObj = req.body;
        const newComment = await commentsService.addComment(commentObj);
        res.send(`The new ID: ${newComment._id}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update a person
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await commentsService.updateComment(id, data);
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete a person
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await commentsService.deleteComment(id);
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;
