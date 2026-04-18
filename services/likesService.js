import * as likesRepo from '../repositories/likesRepo.js';
import * as postsService from './postService.js';
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
const addOrUpdateReaction = async (reactionData) => {

    const post = await postsService.getPostById(reactionData.postId);
    if (!post) {
        throw new Error("Post not found");
    }
    if (post.userId.toString() === reactionData.userId.toString()) {
        throw new Error("Cannot react to your own post");
    }
    return await likesRepo.addOrUpdateReaction(reactionData.userId, reactionData.postId, reactionData.type);
};

const getLikesByType = async (postId, type) => {
    return await likesRepo.getLikesByType(postId, type);
};

export { getAllLikes, getLikeById, addLike, updateLike, deleteLike, deleteManyLikes, getAllLikesGroupByType, addOrUpdateReaction, getLikesByType };
