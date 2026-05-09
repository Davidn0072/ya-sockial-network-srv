import Comments from '../models/commentsModel.js';

// Get Page (cursor-based)
const getCommentsPage = ({ query = {}, options = {} }) => {
    return Comments.find(query)
        .sort(options.sort)
        .limit(options.limit)
        .populate('userId', 'name').lean();
};

// Get By ID
const getCommentById = (id) => {
    return Comments.findById(id).lean();
};

// Create
const addComment = (obj) => {
    return Comments.create(obj);
};

// Update
const updateComment = (id, obj) => {
    return Comments.findByIdAndUpdate(id, obj, { returnDocument: 'after' });
};

// Delete
const deleteComment = (id) => {
    return Comments.findByIdAndDelete(id);
};

// Delete many records
const deleteManyComments = (query) => {
    return Comments.deleteMany(query);
};

// Count comments for a post
const countCommentsByPostId = (postId, parentCommentId = null) => {
    return Comments.countDocuments({ postId, parentCommentId });
};

export { getCommentsPage, getCommentById, addComment, updateComment, deleteComment, deleteManyComments, countCommentsByPostId };
