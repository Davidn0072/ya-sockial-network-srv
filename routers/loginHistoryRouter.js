import express from 'express';
import * as loginService from '../services/loginHistoryService.js';

const router = express.Router();

// Base URL: 'http://localhost:3000/logins'

// Get All Logins
router.get('/', async (req, res) => {
    try {
        const queries = req.query
        const logins = await loginService.getAllLoginHistory(queries);
        res.send(logins);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get By Id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const login = await loginService.getLoginHistoryById(id);
        res.send(login);
    } catch (error) {
        res.status(500).send(error);
    }
});
/*
// Add a new login
router.post('/', async (req, res) => {
    try {
        const loginObj = req.body;
        const newLogin = await loginService.addLogin(loginObj);
        res.send(`The new ID: ${newLogin._id}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update a login
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await loginService.updateLogin(id, data);
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});*/

// Delete a person
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await loginService.deleteLoginHistory(id);
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;
