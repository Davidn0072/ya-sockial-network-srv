import express from 'express';
const router = express.Router();
import { parseError } from '../errors/AppError.js';

import { storageUploadFile } from '../services/storageUploadFileService.js';
import storageUploadFileMiddleware from '../Middlewares/storageUploadFileMiddleware.js';
import * as storageUploadFileService from '../services/storageUploadFileService.js';

//router.post('/:postId', storageUploadFileMiddleware.single('file'), storageUploadFile);
//router.post('/', storageUploadFileMiddleware.single('file'), storageUploadFile);
router.post(
    '/:postId',
    storageUploadFileMiddleware.single('file'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const result = await storageUploadFileService.storageUploadFile(req);
            return res.status(200).json({ message: 'File uploaded successfully', result });
        } catch (error) {
            const { status, message } = parseError(error);
            return res.status(status).json({ message });
        }
    }
);
export default router;