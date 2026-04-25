import Post from '../models/postModel.js';

// Get All
const getAllPosts = ({ query = {}, options = {} } = {}) => {
    return Post.find(query)
        .sort(options.sort)
        .populate('userId', 'name')
        .skip(options.skip || 0)
        .limit(options.limit);
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

// Get By IDs
const getByIds = (ids) => {
    return Post.find({ _id: { $in: ids } })
        .populate('userId', 'name');
};
export { getAllPosts, getPostByFieldId, getPostById, addPost, updatePost, deletePost, getByIds };
