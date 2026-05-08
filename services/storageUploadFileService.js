//import { saveStorageFileInfo } from '../repositories/storageUploadFileRepo.js';
import * as dbUploadFilesService from '../services/dbUploadFilesService.js';

export const storageUploadFile = async (req) => {
  const file = req.file;
  if (!file) {
    throw new Error('No file uploaded');
  }

  const dbUploadFile = await dbUploadFilesService.addDBUploadFile({
    storageFileName: file.filename,
    originalFileName: file.originalname,
    userId: req.user.id,
    postId: req.params.postId
  });

  return dbUploadFile;
};