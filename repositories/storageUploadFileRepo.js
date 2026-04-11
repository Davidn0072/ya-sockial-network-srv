export const saveStorageFileInfo = async (fileData) => {
  // DB (Mongo / SQL)
  console.log('Saving to DB:', fileData);

  return {
    id: Date.now(),
    ...fileData
  };
};