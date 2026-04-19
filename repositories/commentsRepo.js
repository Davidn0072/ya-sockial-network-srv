import Comments from '../models/commentsModel.js';

// Get All
const getAllComments1 = (queries) => {
    return Comments.find(queries);
};

const getAllComments = async ({ postId, page, limit }) => {
    const skip = (page - 1) * limit;

    // console.log("getAllComments postId:" + postId + " page:" + page + " limit:" + limit + " skip:" + skip);

    const comments = await Comments.find({ postId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit + 1).populate('userId', 'name');
    // console.log("getAllComments comments1:");
    //console.log("getAllComments comments:" + comments);
    const hasMore = comments.length > limit;

    if (hasMore) comments.pop();

    return {
        data: comments,
        hasMore
    };
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
