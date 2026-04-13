import { saveStorageFileInfo } from '../repositories/storageUploadFileRepo.js';

export const storageUploadFile = async (req, res) => {
  try {
    const file = req.file;
    const postId = req.body.postId;

    console.log(file);
    console.log(postId);

    if (!file) {
      return res.status(400).send('No file uploaded');
    }

    const savedStorageFileInfo = await saveStorageFileInfo({
      name: file.filename,
      originalName: file.originalname,
      size: file.size
    });

    res.json({
      message: 'File uploaded successfully',
      data: savedStorageFileInfo
    });

  } catch (err) {
    res.status(500).send('Server error');
  }
};