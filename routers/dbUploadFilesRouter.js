import express from 'express';
import * as dbUploadFilesService from '../services/dbUploadFilesService.js';

const router = express.Router();

// Base URL: 'http://localhost:3000/uploadfiles'

// Get All Upload Files
router.get('/', async (req, res) => {
    try {
        const queries = req.query
        const uploadfiles = await dbUploadFilesService.getAllDBUploadFiles(queries);
        res.send(uploadfiles);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get By Id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const uploadfile = await dbUploadFilesService.getDBUploadFileById(id);
        res.send(uploadfile);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Add a new upload file
router.post('/', async (req, res) => {
    try {
        const uploadfileObj = req.body;
        const newUploadFile = await dbUploadFilesService.addDBUploadFile(uploadfileObj);
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
        const result = await dbUploadFilesService.updateDBUploadFile(id, data);
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete a person
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await dbUploadFilesService.deleteDBUploadFile(id);
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;
