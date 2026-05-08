import express from 'express';
import * as postsService from '../services/postService.js';
import { parseError } from '../errors/AppError.js';

const router = express.Router();

// Base URL: 'http://localhost:3000/posts'

// Get Recommended Posts (specific routes first)
router.get('/recommended', async (req, res) => {
    try {
        //console.log('getRecommendedPosts-Router: queries:', JSON.stringify(req.query, null, 2));
        //console.log('getRecommendedPosts-Router: params:', JSON.stringify(req.params, null, 2));
        //console.log('getRecommendedPosts-Router: user:', JSON.stringify(req.user, null, 2));

        const posts = await postsService.getRecommendedPosts(req.user.id);
        res.status(200).json(posts);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

// Get Post With Details (must be before /:id)
router.get('/postWithDetails/:postId', async (req, res) => {
    try {
        const result = await postsService.getPostWithDetails(
            req.params.postId,
            req.query
        );

        res.status(200).json(result);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

// Get Posts By User Id
router.get('/user/:userId', async (req, res) => {
    try {
        //console.log('getPostsByUserId-Router: queries:', JSON.stringify(req.query, null, 2));
        //console.log('getPostsByUserId-Router: params:', JSON.stringify(req.params, null, 2));

        const posts = await postsService.getAllPosts({
            ...req.query,
            userId: req.params.userId
        });
        res.status(200).json(posts);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

// Get By Id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const post = await postsService.getPostById(id);
        res.status(200).json(post);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

// Get All Posts (generic catch-all)
router.get('/', async (req, res) => {
    try {
        //console.log('getAllPosts-Router: queries:', JSON.stringify(req.query, null, 2));
        //console.log('getAllPosts-Router: params:', JSON.stringify(req.params, null, 2));

        const queries = req.query
        //console.log('getAllPosts: queries:', queries);
        const posts = await postsService.getAllPosts(queries);
        res.status(200).json(posts);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

// Add a new post
router.post('/', async (req, res) => {
    try {
        const postObj = {
            ...req.body,
            userId: req.user.id
        };
        const newPost = await postsService.addPost(postObj);
        res.status(201).json({ message: `The new ID: ${newPost._id}` });
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

// Update a post
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const data = req.body;
        const result = await postsService.updatePost(id, userId, data);
        res.status(200).json(result);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

// Delete a post
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const result = await postsService.deletePost(id, userId);
        res.status(200).json(result);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

export default router;
