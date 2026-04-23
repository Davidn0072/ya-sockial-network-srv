import express from 'express';
import * as usersService from '../services/userService.js';

const router = express.Router();

// Base URL: 'http://localhost:3000/users'

// Get All Users
// Search Users (SPECIFIC)
router.get('/search', async (req, res) => {
    try {
        //console.log('searchUsers-Router: req.query:', JSON.stringify(req.query, null, 2));
        //console.log('searchUsers-Router: req.params:', JSON.stringify(req.params, null, 2));
        //const { q } = req.query;
        const users = await usersService.searchUsersByName(req.query);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error });
    }
});


// Get All Users (GENERAL)
router.get('/', async (req, res) => {
    try {
        //console.log('getAllUsers: req.query:', req.query);
        const queries = req.query;
        const users = await usersService.getAllUsers(queries);
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});


// Get By Id (DYNAMIC - MUST BE LAST)
router.get('/:id', async (req, res) => {
    try {
        //console.log('getUserById: req.params:', req.params);
        const { id } = req.params;
        const user = await usersService.getUserById(id);
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Add a new user
router.post('/', async (req, res) => {
    try {
        const userObj = req.body;
        const newUser = await usersService.addUser(userObj);
        res.send(`The new ID: ${newUser._id}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update a user
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await usersService.updateUser(id, data);
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete a user
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await usersService.deleteUser(id);
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;
