import Comments from '../models/commentsModel.js';

// Get All
const getAllComments = (queries) => {
    return Comments.find(queries);
};

// Get By ID
const getCommentById = (id) => {
    return Comments.findById(id);
};

// Create
const addComment = (obj) => {
    return Comments.create(obj);
};

// Update
const updateComment = (id, obj) => {
    return Comments.findByIdAndUpdate(id, obj);
};

// Delete
const deleteComment = (id) => {
    return Comments.findByIdAndDelete(id);
};

// Delete many records
const deleteManyComments = (query) => {
    return Comments.deleteMany(query);
};

export { getAllComments, getCommentById, addComment, updateComment, deleteComment, deleteManyComments };
