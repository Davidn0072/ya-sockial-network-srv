import fs from 'fs/promises';
import path from 'path';
/*
const saveStorageFileInfo = async (fileData) => {
  // DB (Mongo / SQL)
  console.log('Saving to DB:', fileData);

  return {
    id: Date.now(),
    ...fileData
  };
};*/

const deleteStorageFileInfo = async (filename) => {
  const filePath = path.join('uploads', filename);

  try {
    console.log('Deleting file1:', filePath);
    await fs.access(filePath);
    await fs.unlink(filePath);
    console.log('Deleted file2:', filePath);
    return true;
  } catch (err) {
    throw new Error(`File delete failed: ${err.message}`);
  }
};

export { deleteStorageFileInfo };