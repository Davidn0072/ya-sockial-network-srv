import * as uploadfileRepo from '../repositories/uploadfileDB.Repo.js';

// Get All
const getAllUploadFiles = (queries) => {
    return uploadfileRepo.getAllUploadFiles(queries);
};

// Get By ID
const getUploadFileById = (id) => {
    return uploadfileRepo.getUploadFileById(id);
};

// Create
const addUploadFile = (obj) => {
    return uploadfileRepo.addUploadFile(obj);
};

// Update
const updateUploadFile = (id, obj) => {
    return uploadfileRepo.updateUploadFile(id, obj);
};

// Delete
const deleteUploadFile = (id) => {
    return uploadfileRepo.deleteUploadFile(id);
};

// Delete many records
const deleteManyUploadFiles = (query) => {
    return uploadfileRepo.deleteManyUploadFiles(query);
};

export { getAllUploadFiles, getUploadFileById, addUploadFile, updateUploadFile, deleteUploadFile, deleteManyUploadFiles };
