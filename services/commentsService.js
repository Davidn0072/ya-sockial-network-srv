import * as commentsRepo from '../repositories/commentsRepo.js';
import { buildPagination, buildCursorResponse } from '../utils/pagination.js';

// Get All
const getAllComments = (queries) => {
    return commentsRepo.getAllComments(queries);
};

// Get All Paged (cursor-based - like files)
const getAllCommentsPaged = async (params) => {
    const { query, options } = buildPagination({
        cursor: params.cursor,
        limit: params.limit || 10
    });

    const comments = await commentsRepo.getCommentsPage({
        query: { ...query, postId: params.postId, parentCommentId: params.parentCommentId ?? null },
        options
    });

    return buildCursorResponse({ comments });
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

export { getAllComments, getAllCommentsPaged, getCommentById, addComment, updateComment, deleteComment, deleteManyComments };
