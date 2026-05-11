import Post from '../models/postModel.js';

// Get All
const getAllPosts = ({ query = {}, options = {} } = {}) => {
    return Post.find(query)
        .sort(options.sort)
        .populate('userId', 'name')
        .limit(options.limit).lean();
};
// Get By ID
const getPostById = (id) => {
    return Post.findById(id).populate('userId', 'name').lean();
};

// Create
const addPost = (obj) => {
    return Post.create(obj);
};

// Update
const updatePost = (id, obj) => {
    return Post.findByIdAndUpdate(id, obj, { returnDocument: 'after' });
};

// Delete
const deletePost = (id) => {
    return Post.findByIdAndDelete(id);
};

// Get By Field ID
const getPostByFieldId = (queries) => {
    return Post.find(queries).lean();
};

// Get By IDs
const getByIds = (ids) => {
    return Post.find({ _id: { $in: ids } })
        .populate('userId', 'name').lean();
};
export { getAllPosts, getPostByFieldId, getPostById, addPost, updatePost, deletePost, getByIds };
