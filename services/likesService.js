import * as likesRepo from '../repositories/likesRepo.js';

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
const getAllLikesGroupByStatus = async (queries) => {
    return await likesRepo.getAllLikesGroupByStatus(queries);
};
export { getAllLikes, getLikeById, addLike, updateLike, deleteLike, deleteManyLikes, getAllLikesGroupByStatus };
