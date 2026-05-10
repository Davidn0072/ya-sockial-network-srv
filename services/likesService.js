import * as likesRepo from '../repositories/likesRepo.js';
import { buildPagination, buildCursorResponse } from "../utils/pagination.js";
import { AppError, parseError } from '../errors/AppError.js';
import { getPostById } from '../services/postService.js';
import { getCommentById } from '../services/commentsService.js';
import { getUserById } from '../services/userService.js';


// Get By ID
const getLikeById = async (id) => {
    const like = await likesRepo.getLikeById(id);
    if (!like) {
        throw new AppError("Like not found", 404);
    }
    return like;
};

// Update
const updateLike = async (id, obj, userId) => {
    const like = await getLikeById(id);
    if (!like) {
        throw new AppError("Like not found", 404);
    }
    if (like.userId.toString() !== userId.toString()) {
        throw new AppError("You are not authorized to update this like", 403);
    }
    const updatedLike = await likesRepo.updateLike(id, obj);
    if (!updatedLike) {
        throw new AppError("Failed to update like", 400);
    }
    return updatedLike;
};

// Delete
const deleteLike = async (id, userId) => {
    const like = await getLikeById(id);
    if (!like) {
        throw new AppError("Like not found", 404);
    }
    if (like.userId.toString() !== userId.toString()) {
        throw new AppError("You are not authorized to delete this like", 403);
    }
    const deletedLike = await likesRepo.deleteLike(id);
    if (!deletedLike) {
        throw new AppError("Failed to delete like", 400);
    }
    return deletedLike;
};

// Delete many records
const deleteManyLikes = (query) => {
    //console.log(query);
    return likesRepo.deleteManyLikes(query);
};
const getAllLikesGroupByType = async (queries) => {
    return await likesRepo.getAllLikesGroupByType(queries);
};

const checkTargetAndTargetTypesAreValid = async (userId, targetId, targetType) => {
    if (targetType === 'post') {
        const post = await getPostById(targetId);
        if (!post) {
            throw new AppError("Post not found", 404);
        }
        if (post.userId._id.toString() === userId.toString()) {
            throw new AppError("You can not like your own post", 403);
        }
    }
    else {
        if ((targetType === 'comment') || (targetType === 'reply')) {
            const comment = await getCommentById(targetId);
            if (!comment) {
                throw new AppError("Comment not found", 404);
            }
            if (comment.userId._id.toString() === userId.toString()) {
                throw new AppError("You can not like your own comment", 403);
            }
        } else {
            throw new AppError("Target type not supported", 400);
        }
    }
    return true;
};
const addOrUpdateReaction = async ({ userId, targetId, targetType, type }) => {
    try {
        //console.log("addOrUpdateReaction-input:", { userId, targetId, targetType, type });

        if (!await getUserById(userId)) {
            throw new AppError("User not found", 404);
        }
        await checkTargetAndTargetTypesAreValid(userId, targetId, targetType);

        const existing = await likesRepo.getLikeByUserIdAndTargetIdAndTargetType({
            userId,
            targetId,
            targetType
        });

        //console.log("existing-reaction:", existing);

        if (!existing) {
            const created = await likesRepo.addLike({
                userId,
                targetId,
                targetType,
                type
            });

            return {
                action: 'created',
                reaction: created
            };
        }
        //console.log("addOrUpdateReaction-existing.type:", JSON.stringify(existing) + " type: " + type);
        if (existing.type === type) {
            await likesRepo.deleteLike(existing._id);
            //console.log("deleteLike-existing:", existing._id);
            return {
                action: 'deleted',
                reaction: null
            };
        }

        existing.type = type;

        const updated = await likesRepo.updateLike(existing._id, {
            type
        });

        return {
            action: 'updated',
            reaction: updated
        };

    } catch (error) {
        const { status, message } = parseError(error);
        throw new AppError(message, status);
    }
};


const getLikesByType = async (params) => {
    const fldSearch = {
        postId: params.postId,
        reactionType: params.reactionType
    };

    const paginationParams = {
        limit: 10,
        cursor: params.cursor
    };

    const { query, options } = buildPagination(paginationParams);
    const users = await likesRepo.getLikesByType(fldSearch.postId, fldSearch.reactionType, query, options);
    const response = buildCursorResponse({ users });
    return response;
};

export { getLikeById, updateLike, deleteLike, deleteManyLikes, getAllLikesGroupByType, addOrUpdateReaction, getLikesByType };
