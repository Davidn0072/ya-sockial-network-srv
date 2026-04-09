import * as commentsRepo from '../repositories/commentsRepo.js';

// Get All
const getAllComments = (queries) => {
    return commentsRepo.getAllComments(queries);
};

// Get By ID
const getCommentById = (id) => {
    return commentsRepo.getCommentById(id);
};

// Create
const addComment = (obj) => {
    return commentsRepo.addComment(obj);
};

// Update
const updateComment = (id, obj) => {
    return commentsRepo.updateComment(id, obj);
};

// Delete
const deleteComment = (id) => {
    return commentsRepo.deleteComment(id);
};

// Delete many records
const deleteManyComments = (query) => {
    return commentsRepo.deleteManyComments(query);
};

export { getAllComments, getCommentById, addComment, updateComment, deleteComment, deleteManyComments };
