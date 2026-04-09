import express from 'express';
import * as uploadfileService from '../services/uploadfileService.js';

const router = express.Router();

// Base URL: 'http://localhost:3000/uploadfiles'

// Get All Upload Files
router.get('/', async (req, res) => {
    try {
        const queries = req.query
        const uploadfiles = await uploadfileService.getAllUploadFiles(queries);
        res.send(uploadfiles);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get By Id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const uploadfile = await uploadfileService.getUploadFileById(id);
        res.send(uploadfile);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Add a new upload file
router.post('/', async (req, res) => {
    try {
        const uploadfileObj = req.body;
        const newUploadFile = await uploadfileService.addUploadFile(uploadfileObj);
        res.send(`The new ID: ${newUploadFile._id}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update a upload file
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await uploadfileService.updateUploadFile(id, data);
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete a person
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await uploadfileService.deleteUploadFile(id);
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;
