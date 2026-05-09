import express from 'express';
import * as usersService from '../services/userService.js';
import { parseError } from '../errors/AppError.js';

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
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});


// Get All Users (GENERAL)
router.get('/', async (req, res) => {
    try {
        //console.log('getAllUsers: req.query:', req.query);
        const queries = req.query;
        const users = await usersService.getAllUsers(queries);
        res.status(200).json(users);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});


// Get By Id (DYNAMIC - MUST BE LAST)
router.get('/:id', async (req, res) => {
    try {
        //console.log('getUserById: req.params:', req.params);
        const { id } = req.params;
        const user = await usersService.getUserById(id);
        res.status(200).json(user);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

// Add a new user
router.post('/', async (req, res) => {
    try {
        const userObj = req.body;
        const newUser = await usersService.addUser(userObj);
        res.status(201).json({ message: `The new ID: ${newUser._id}` });
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

// Update a user
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const authenticatedUserId = req.user.id;
        const data = req.body;
        const result = await usersService.updateUser(id, data, authenticatedUserId);
        res.status(200).json(result);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

// Delete a user
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const authenticatedUserId = req.user.id;
        const result = await usersService.deleteUser(id, authenticatedUserId);
        res.status(200).json(result);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

export default router;
