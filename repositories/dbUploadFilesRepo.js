import dbUploadFilesModel from '../models/dbUploadFilesModel.js';

// Get All
const getAllDBUploadFiles = (queries) => {
    return dbUploadFilesModel.find(queries).lean();
};

// Get Page (cursor-based)
const getDBUploadFilesPage = ({ query = {}, options = {} }) => {
    return dbUploadFilesModel.find(query)
        .sort(options.sort)
        .limit(options.limit).lean();
};

// Get By ID
const getDBUploadFileById = (id) => {
    return dbUploadFilesModel.findById(id).lean();
};

// Create
const addDBUploadFile = (obj) => {
    return dbUploadFilesModel.create(obj);
};

// Update
const updateDBUploadFile = (id, obj) => {
    return dbUploadFilesModel.findByIdAndUpdate(id, obj, { new: true });
};

// Delete
const deleteDBUploadFile = (id) => {
    return dbUploadFilesModel.findByIdAndDelete(id);
};

// Delete many records
const deleteManyDBUploadFiles = (query) => {
    return dbUploadFilesModel.deleteMany(query);
};

export { getAllDBUploadFiles, getDBUploadFilesPage, getDBUploadFileById, addDBUploadFile, updateDBUploadFile, deleteDBUploadFile, deleteManyDBUploadFiles };
