import * as likesRepo from '../repositories/likesRepo.js';
import * as postsService from './postService.js';
import { buildPagination } from "../utils/pagination.js";
// Get All
const getAllLikes = (queries) => {
    return likesRepo.getAllLikes(queries);
};

// Get By ID
const getLikeById = (id) => {
    return likesRepo.getLikeById(id);
};

// Create
const addLike = (obj) => {
    return likesRepo.addLike(obj);
};

// Update
const updateLike = (id, obj) => {
    return likesRepo.updateLike(id, obj);
};

// Delete
const deleteLike = (id) => {
    return likesRepo.deleteLike(id);
};

// Delete many records
const deleteManyLikes = (query) => {
    console.log(query);
    return likesRepo.deleteManyLikes(query);
};
const getAllLikesGroupByType = async (queries) => {
    return await likesRepo.getAllLikesGroupByType(queries);
};
const addOrUpdateReaction = async ({ userId, targetId, targetType, type }) => {
    try {
        console.log("addOrUpdateReaction-input:", { userId, targetId, targetType, type });


        const existing = await likesRepo.getLikeByUserIdAndTargetIdAndTargetType({
            userId,
            targetId,
            targetType
        });

        console.log("existing-reaction:", existing);

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
        console.log("addOrUpdateReaction-existing.type:", JSON.stringify(existing) + " type: " + type);
        if (existing.type === type) {
            await likesRepo.deleteLike(existing._id);
            console.log("deleteLike-existing:", existing._id);
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

    } catch (err) {
        console.error("addOrUpdateReaction-error:", err);
        throw err;
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
    const lastUser = users[users.length - 1];

    return {
        users,
        nextCursor: lastUser ? lastUser._id : null
    };
};

export { getAllLikes, getLikeById, addLike, updateLike, deleteLike, deleteManyLikes, getAllLikesGroupByType, addOrUpdateReaction, getLikesByType };
