import multer from 'multer';
import fs from 'fs';

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
/*

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

*/

export default multer({ storage });