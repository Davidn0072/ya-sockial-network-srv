import * as likesRepo from '../repositories/likesRepo.js';
import { buildPagination, buildCursorResponse } from "../utils/pagination.js";
import { AppError, parseError } from '../errors/AppError.js';

// Get All
const getAllLikes = (queries) => {
    return likesRepo.getAllLikes(queries);
};

// Get By ID
const getLikeById = async (id) => {
    const like = await likesRepo.getLikeById(id);
    if (!like) {
        throw new AppError("Like not found", 404);
    }
    return like;
};

// Create
const addLike = async (obj) => {
    const newLike = await likesRepo.addLike(obj);
    if (!newLike) {
        throw new AppError("Failed to create like", 400);
    }
    return newLike;
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
const addOrUpdateReaction = async ({ userId, targetId, targetType, type }) => {
    try {
        //console.log("addOrUpdateReaction-input:", { userId, targetId, targetType, type });


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

export { getAllLikes, getLikeById, addLike, updateLike, deleteLike, deleteManyLikes, getAllLikesGroupByType, addOrUpdateReaction, getLikesByType };
