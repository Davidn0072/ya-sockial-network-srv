import * as commentsRepo from '../repositories/commentsRepo.js';
import { buildPagination, buildCursorResponse } from '../utils/pagination.js';
import { validateContent } from '../utils/validators.js';
import { AppError } from '../errors/AppError.js';
import { getPostById } from '../services/postService.js';

// Get All Paged (cursor-based)
const getAllCommentsPaged = async (params) => {

    const { postId, parentCommentId, cursor, limit } = params;

    if (!postId) {
        throw new AppError('postId is required', 400);
    }


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
const getCommentById = async (id) => {
    const comment = await commentsRepo.getCommentById(id);
    if (!comment) {
        throw new AppError('Comment not found', 404);
    }
    return comment;
};

// Create
const addComment = async (obj, userId) => {
    const post = await getPostById(obj.postId);
    if (!post) {
        throw new AppError("Post not found", 404);
    }

    const content = validateContent(obj.content);
    const newComment = await commentsRepo.addComment({ ...obj, content, userId });
    if (!newComment) {
        throw new AppError('Failed to create comment', 400);
    }
    return newComment;
};

// Update
const updateComment = async (id, obj, userId) => {
    const comment = await commentsRepo.getCommentById(id);
    if (!comment) {
        throw new AppError('Comment not found', 404);
    }

    if (comment.userId.toString() !== userId) {
        throw new AppError('Not authorized', 401);
    }

    if (obj.content !== undefined) {
        obj.content = validateContent(obj.content);
    }
    const updatedComment = await commentsRepo.updateComment(id, obj);
    if (!updatedComment) {
        throw new AppError('Failed to update comment', 400);
    }
    return updatedComment;
};

// Delete
const deleteComment = async (id, userId) => {
    const comment = await commentsRepo.getCommentById(id);
    if (!comment) {
        throw new AppError('Comment not found', 404);
    }

    if (comment.userId.toString() !== userId) {
        throw new AppError('Not authorized', 401);
    }

    const deletedComment = await commentsRepo.deleteComment(id);
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

export { getAllCommentsPaged, getCommentById, addComment, updateComment, deleteComment, deleteManyComments, countCommentsByPostId };
