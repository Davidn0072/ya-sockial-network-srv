import express from 'express';
import * as dbUploadFilesService from '../services/dbUploadFilesService.js';
import { parseError } from '../errors/AppError.js';

const router = express.Router();

// Base URL: 'http://localhost:3000/uploadfiles'

// Get All Upload Files (with cursor-based pagination for post)
router.get('/', async (req, res) => {
    try {
        const queries = req.query;
        const files = await dbUploadFilesService.getAllDBUploadFilesPaged(queries);
        res.status(200).json(files);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

// Get By Id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const uploadfile = await dbUploadFilesService.getDBUploadFileById(id);
        res.status(200).json(uploadfile);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

/*
NOT USED: the file is uploaded to the storage first, then the DB is updated.
// Add a new upload file
router.post('/', async (req, res) => {
    try {
        const uploadfileObj = req.body;
        const newUploadFile = await dbUploadFilesService.addDBUploadFile(uploadfileObj, req.user.id);
        res.status(201).json({ message: `The new ID: ${newUploadFile._id}` });
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});
*/

// Update a upload file
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await dbUploadFilesService.updateDBUploadFile(id, data, req.user.id);
        res.status(200).json(result);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

// Delete a upload file
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        //console.log('Deleting file:', id);
        const result = await dbUploadFilesService.deleteDBUploadFile(id, req.user.id);
        res.status(200).json(result);
    } catch (error) {
        const { status, message } = parseError(error);
        res.status(status).json({ message });
    }
});

export default router;
