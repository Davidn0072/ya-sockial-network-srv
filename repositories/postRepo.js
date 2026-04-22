import Post from '../models/postModel.js';

// Get All
const getAllPosts = ({ query, options }) => {
    //console.log('getAllPosts-Repo: query:', JSON.stringify(query, null, 2));
    //console.log('getAllPosts-Repo: options:', JSON.stringify(options, null, 2));
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

export { getAllPosts, getPostByFieldId, getPostById, addPost, updatePost, deletePost };
