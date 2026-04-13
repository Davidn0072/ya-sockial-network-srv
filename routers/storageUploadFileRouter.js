import express from 'express';
const router = express.Router();

import { storageUploadFile } from '../services/storageUploadFileService.js';
import storageUploadFileMiddleware from '../Middlewares/storageUploadFileMiddleware.js';

// כאן הבקשה נכנסת
router.post('/:postId', storageUploadFileMiddleware.single('file'), storageUploadFile);

export default router;