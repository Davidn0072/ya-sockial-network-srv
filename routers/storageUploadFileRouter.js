import express from 'express';
const router = express.Router();

import { storageUploadFile } from '../services/storageUploadFileService.js';
import storageUploadFileMiddleware from '../Middlewares/storageUploadFileMiddleware.js';

// כאן הבקשה נכנסת
router.post('/', storageUploadFileMiddleware.single('file'), storageUploadFile);

export default router;