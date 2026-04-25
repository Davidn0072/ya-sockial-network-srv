import express from 'express';
import * as postsService from '../services/postService.js';

const router = express.Router();

// Base URL: 'http://localhost:3000/posts'

// Get Recommended Posts
router.get('/recommended', async (req, res) => {
    try {
        //console.log('getRecommendedPosts-Router: queries:', JSON.stringify(req.query, null, 2));
        //console.log('getRecommendedPosts-Router: params:', JSON.stringify(req.params, null, 2));
        //console.log('getRecommendedPosts-Router: user:', JSON.stringify(req.user, null, 2));

        const posts = await postsService.getRecommendedPosts(req.user.id);
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send(error);
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
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send(error);
    }
});
// Get All Posts
router.get('/', async (req, res) => {
    try {
        //console.log('getAllPosts-Router: queries:', JSON.stringify(req.query, null, 2));
        //console.log('getAllPosts-Router: params:', JSON.stringify(req.params, null, 2));

        const queries = req.query
        //console.log('getAllPosts: queries:', queries);
        const posts = await postsService.getAllPosts(queries);
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get By Id
router.get('/:id', async (req, res) => {
    try {
        //console.log('getPostById-Router: queries:', JSON.stringify(req.query, null, 2));
        //console.log('getPostById-Router: params:', JSON.stringify(req.params, null, 2));

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
