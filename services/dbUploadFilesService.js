import * as dbUploadFilesRepo from '../repositories/dbUploadFilesRepo.js';
import * as storageUploadFileRepo from '../repositories/storageUploadFileRepo.js';
import { buildPagination, buildCursorResponse } from "../utils/pagination.js";

// Get All
const getAllDBUploadFiles = (queries) => {
    return dbUploadFilesRepo.getAllDBUploadFiles(queries);
};

// Get All Paged (cursor-based)
const getAllDBUploadFilesPaged = async (params) => {
    const { query, options } = buildPagination({
        cursor: params.cursor,
        limit: params.limit || 10
    });

    const files = await dbUploadFilesRepo.getDBUploadFilesPage({
        query: { ...query, postId: params.postId },
        options
    });

    return buildCursorResponse({ files });
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
const deleteDBUploadFile = async (id) => {
    const uploadfile = await getDBUploadFileById(id);

    if (!uploadfile) {
        throw new Error('File not found in DB');
    }

    await storageUploadFileRepo.deleteStorageFileInfo(uploadfile.postId + '/' + uploadfile.storageFileName);

    return await dbUploadFilesRepo.deleteDBUploadFile(id);
};

// Delete many records
const deleteManyDBUploadFiles = (query) => {
    return dbUploadFilesRepo.deleteManyDBUploadFiles(query);
};

export { getAllDBUploadFiles, getAllDBUploadFilesPaged, getDBUploadFileById, addDBUploadFile, updateDBUploadFile, deleteDBUploadFile, deleteManyDBUploadFiles };
