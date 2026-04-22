import Post from '../models/postModel.js';

// Get All
const getAllPosts = (queries) => {
    return Post.find(queries).sort({ createdAt: -1 }).populate('userId', 'name');
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

const getPostsByUserId = async (userId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    //console.log('getPostsByUserId: userId:', userId);
    //console.log('getPostsByUserId: userId:', typeof userId);
    //console.log('getPostsByUserId: userId:', JSON.stringify(userId));
    return Post.find({ userId })
        .sort({ createdAt: -1 })
        .populate('userId', 'name');
    //.skip(skip)
    //.limit(limit);
};

export { getAllPosts, getPostByFieldId, getPostById, addPost, updatePost, deletePost, getPostsByUserId };
