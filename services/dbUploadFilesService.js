import * as dbUploadFilesRepo from '../repositories/dbUploadFilesRepo.js';
import * as storageUploadFileRepo from '../repositories/storageUploadFileRepo.js';
import { buildPagination, buildCursorResponse } from "../utils/pagination.js";
import { AppError } from '../errors/AppError.js';

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
    const uploadfile = dbUploadFilesRepo.getDBUploadFileById(id);
    if (!uploadfile) {
        throw new AppError('File not found in DB', 404);
    }
    return uploadfile;
};

// Create
const addDBUploadFile = (obj) => {
    const newUploadFile = dbUploadFilesRepo.addDBUploadFile(obj);
    if (!newUploadFile) {
        throw new AppError('Failed to create file in DB', 400);
    }
    return newUploadFile;
};

// Update
const updateDBUploadFile = (id, obj) => {
    const updatedUploadFile = dbUploadFilesRepo.updateDBUploadFile(id, obj);
    if (!updatedUploadFile) {
        throw new AppError('Failed to update file in DB', 400);
    }
    return updatedUploadFile;
};

// Delete
const deleteDBUploadFile = async (id) => {
    const uploadfile = await getDBUploadFileById(id);

    if (!uploadfile) {
        throw new AppError('File not found in DB', 404);
    }

    await storageUploadFileRepo.deleteStorageFileInfo(uploadfile.postId + '/' + uploadfile.storageFileName);

    return await dbUploadFilesRepo.deleteDBUploadFile(id);
};

// Delete many records
const deleteManyDBUploadFiles = (query) => {
    return dbUploadFilesRepo.deleteManyDBUploadFiles(query);
};

// Count DB Upload Files by Post ID
const countDBUploadFilesByPostId = (postId) => {
    return dbUploadFilesRepo.countDBUploadFilesByPostId(postId);
};

export { getAllDBUploadFiles, getAllDBUploadFilesPaged, getDBUploadFileById, addDBUploadFile, updateDBUploadFile, deleteDBUploadFile, deleteManyDBUploadFiles, countDBUploadFilesByPostId };
