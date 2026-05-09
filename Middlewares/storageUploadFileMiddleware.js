import multer from 'multer';
import fs from 'fs';
import { AppError } from '../errors/AppError.js';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //const postId = req.query.postId;
    const postId = req.params.postId;
    const dir = `uploads/${postId}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    //const postId = req.query.postId;
    const postId = req.params.postId;
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new AppError(
        `File type not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
        400
      )
    );
  }
  cb(null, true);
};

export default multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
});