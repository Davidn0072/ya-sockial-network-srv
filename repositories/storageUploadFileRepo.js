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

const deletePostFolder = async (postId) => {
  const folderPath = path.join('uploads', String(postId));

  try {
    console.log('deletePostFolder:', folderPath);
    await fs.access(folderPath);

    const files = await fs.readdir(folderPath);

    await Promise.all(
      files.map(file =>
        fs.unlink(path.join(folderPath, file))
      )
    );

    await fs.rmdir(folderPath);

    console.log(`Folder deleted: ${folderPath}`);
    return true;

  } catch (err) {
    console.error(`Failed deleting folder ${folderPath}:`, err.message);
    return false;
  }
};

export { deleteStorageFileInfo, deletePostFolder };