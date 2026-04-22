import express from 'express';
import * as postsService from '../services/postService.js';

const router = express.Router();

// Base URL: 'http://localhost:3000/posts'

// Get Posts By User Id
router.get('/user/:userId', async (req, res) => {
    try {
        //console.log('getPostsByUserId: queries:', JSON.stringify(queries, null, 2));

        const posts = await postsService.getAllPosts({
            ...req.query,
            userId: req.params.userId
        });
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send(error);
    }
});
// Get All Posts
router.get('/', async (req, res) => {
    try {
        const queries = req.query
        //console.log('getAllPosts: queries:', queries);
        const posts = await postsService.getAllPosts(queries);
        res.send(posts);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get By Id
router.get('/:id', async (req, res) => {
    try {
        //console.log('getPostById: id:', req.params);
        const { id } = req.params;
        const post = await postsService.getPostById(id);
        res.send(post);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Add a new person
router.post('/', async (req, res) => {
    try {
        const postObj = req.body;
        const newPost = await postsService.addPost(postObj);
        res.send(`The new ID: ${newPost._id}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update a person
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await postsService.updatePost(id, data);
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete a person
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await postsService.deletePost(id);
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/postWithDetails/:postId', async (req, res) => {
    try {
        const result = await postsService.getPostWithDetails(
            req.params.postId,
            req.query
        );

        res.json(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default router;
