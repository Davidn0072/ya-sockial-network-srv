import Post from '../models/postModel.js';

// Get All
const getAllPosts = (queries) => {
    return Post.find(queries);
};

// Get By ID
const getPostById = (id) => {
    return Post.findById(id);
};

// Create
const addPost = (obj) => {
    return Post.create(obj);
};

// Update
const updatePost = (id, obj) => {
    return Post.findByIdAndUpdate(id, obj);
};

// Delete
const deletePost = (id) => {
    return Post.findByIdAndDelete(id);
};

// Get By Field ID
const getPostByFieldId = (queries) => {
    return Post.find(queries);
};

export { getAllPosts, getPostByFieldId, getPostById, addPost, updatePost, deletePost };
