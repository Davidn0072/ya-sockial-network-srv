import * as commentsRepo from '../repositories/commentsRepo.js';
import { buildPagination, buildCursorResponse } from '../utils/pagination.js';
import { AppError } from '../errors/AppError.js';

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
    const comment = commentsRepo.getCommentById(id);
    if (!comment) {
        throw new AppError('Comment not found', 404);
    }
    return comment;
};

// Create
const addComment = (obj) => {
    const newComment = commentsRepo.addComment(obj);
    if (!newComment) {
        throw new AppError('Failed to create comment', 400);
    }
    return newComment;
};

// Update
const updateComment = (id, obj) => {
    const updatedComment = commentsRepo.updateComment(id, obj);
    if (!updatedComment) {
        throw new AppError('Failed to update comment', 400);
    }
    return updatedComment;
};

// Delete
const deleteComment = (id) => {
    const deletedComment = commentsRepo.deleteComment(id);
    if (!deletedComment) {
        throw new AppError('Failed to delete comment', 400);
    }
    return deletedComment;
};

// Delete many records
const deleteManyComments = (query) => {
    return commentsRepo.deleteManyComments(query);
};

// Count comments for a post
const countCommentsByPostId = (postId, parentCommentId = null) => {
    return commentsRepo.countCommentsByPostId(postId, parentCommentId);
};

export { getAllComments, getAllCommentsPaged, getCommentById, addComment, updateComment, deleteComment, deleteManyComments, countCommentsByPostId };
