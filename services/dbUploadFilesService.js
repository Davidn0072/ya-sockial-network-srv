import * as dbUploadFilesRepo from '../repositories/dbUploadFilesRepo.js';

// Get All
const getAllDBUploadFiles = (queries) => {
    return dbUploadFilesRepo.getAllDBUploadFiles(queries);
};

// Get By ID
const getDBUploadFileById = (id) => {
    return dbUploadFilesRepo.getDBUploadFileById(id);
};

// Create
const addDBUploadFile = (obj) => {
    return dbUploadFilesRepo.addDBUploadFile(obj);
};

// Update
const updateDBUploadFile = (id, obj) => {
    return dbUploadFilesRepo.updateDBUploadFile(id, obj);
};

// Delete
const deleteDBUploadFile = (id) => {
    return dbUploadFilesRepo.deleteDBUploadFile(id);
};

// Delete many records
const deleteManyDBUploadFiles = (query) => {
    return dbUploadFilesRepo.deleteManyDBUploadFiles(query);
};

export { getAllDBUploadFiles, getDBUploadFileById, addDBUploadFile, updateDBUploadFile, deleteDBUploadFile, deleteManyDBUploadFiles };
