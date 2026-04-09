import UploadFile from '../models/uploadfileModel.js';

// Get All
const getAllUploadFiles = (queries) => {
    return UploadFile.find(queries);
};

// Get By ID
const getUploadFileById = (id) => {
    return UploadFile.findById(id);
};

// Create
const addUploadFile = (obj) => {
    return UploadFile.create(obj);
};

// Update
const updateUploadFile = (id, obj) => {
    return UploadFile.findByIdAndUpdate(id, obj);
};

// Delete
const deleteUploadFile = (id) => {
    return UploadFile.findByIdAndDelete(id);
};

// Delete many records
const deleteManyUploadFiles = (query) => {
    return UploadFile.deleteMany(query);
};

export { getAllUploadFiles, getUploadFileById, addUploadFile, updateUploadFile, deleteUploadFile, deleteManyUploadFiles };
