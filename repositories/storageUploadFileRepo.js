import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';

/*
const saveStorageFileInfo = async (fileData) => {
  console.log('Saving to DB:', fileData);

  return {
    id: Date.now(),
    ...fileData
  };
};
*/

const deleteStorageFileInfo = async (filename) => {
  const filePath = path.join('uploads', filename);

  try {
    console.log('Deleting file:', filePath);

    // נבדוק קיום בצורה async-ית נקייה
    await fs.access(filePath);

    await fs.unlink(filePath);

    console.log('Deleted file:', filePath);
    return true;

  } catch (err) {
    // אם הקובץ לא קיים או שגיאה אחרת
    throw new Error(`File delete failed: ${err.message}`);
  }
};

const deletePostFolder = async (postId) => {
  const folderPath = path.join('uploads', String(postId));

  try {
    console.log('deletePostFolder:', folderPath);

    // בדיקת קיום (sync קצר ולעניין)
    if (!fsSync.existsSync(folderPath)) {
      return true;
    }

    // קבלת כל הקבצים בתיקייה
    const files = await fs.readdir(folderPath);

    // מחיקת כל הקבצים
    await Promise.all(
      files.map(file =>
        fs.unlink(path.join(folderPath, file))
      )
    );

    // מחיקת התיקייה עצמה (גרסה מודרנית במקום rmdir)
    await fs.rm(folderPath, {
      recursive: true,
      force: true
    });

    console.log(`Folder deleted: ${folderPath}`);
    return true;

  } catch (err) {
    console.error(`Failed deleting folder ${folderPath}:`, err.message);
    return false;
  }
};

export {
  deleteStorageFileInfo,
  deletePostFolder
};