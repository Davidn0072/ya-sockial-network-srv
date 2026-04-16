//import { saveStorageFileInfo } from '../repositories/storageUploadFileRepo.js';
import * as dbUploadFilesService from '../services/dbUploadFilesService.js';

export const storageUploadFile = async (req, res) => {
  const file = req.file;
  if (!file) {
    throw new Error('No file uploaded');
  }
  //console.log("storageUploadFile11:", file);
  const dbUploadFile = await dbUploadFilesService.addDBUploadFile({
    storageFileName: file.filename,
    originalFileName: file.originalname,
    userId: req.user.id,
    postId: req.params.postId
  });
  //console.log("dbUploadFile11:", dbUploadFile);
  return dbUploadFile;
};