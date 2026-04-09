import Likes from '../models/likesModel.js';

// Get All
const getAllLikes = (queries) => {
    return Likes.find(queries);
};

// Get By ID
const getLikeById = (id) => {
    return Likes.findById(id);
};

// Create
const addLike = (obj) => {
    return Likes.create(obj);
};

// Update
const updateLike = (id, obj) => {
    return Likes.findByIdAndUpdate(id, obj);
};

// Delete
const deleteLike = (id) => {
    return Likes.findByIdAndDelete(id);
};

// Delete many records
const deleteManyLikes = (query) => {
    return Likes.deleteMany(query);
};

export { getAllLikes, getLikeById, addLike, updateLike, deleteLike, deleteManyLikes };
