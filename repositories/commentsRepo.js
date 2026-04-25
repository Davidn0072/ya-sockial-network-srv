import Comments from '../models/commentsModel.js';

// Get All
const getAllComments1 = (queries) => {
    return Comments.find(queries);
};

const getAllComments = async ({ postId, parentCommentId, page, limit, sortDir = -1 }) => {
    const numericSortDir = Number(sortDir) === 1 ? 1 : -1;
    const safePage = Number(page) > 0 ? Number(page) : 1;
    const safeLimit = Number(limit) > 0 ? Number(limit) : 10;
    const skip = (safePage - 1) * safeLimit;

    // console.log("getAllComments postId:" + postId + " parentCommentId:" + parentCommentId + " page:" + page + " limit:" + limit + " skip:" + skip);

    const comments = await Comments.find({ postId, parentCommentId })
        .sort({ createdAt: numericSortDir })
        //.skip(skip)
        //.limit(limit + 1)
        .populate('userId', 'name');
    // console.log("getAllComments comments1:");
    //console.log("getAllComments comments:" + comments);
    const hasMore = comments.length > safeLimit;

    if (hasMore) comments.pop();

    return {
        data: comments,
        hasMore
    };
};

// Get Page (cursor-based)
const getCommentsPage = ({ query = {}, options = {} }) => {
    return Comments.find(query)
        .sort(options.sort)
        .limit(options.limit)
        .populate('userId', 'name');
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

export { getAllComments, getCommentsPage, getCommentById, addComment, updateComment, deleteComment, deleteManyComments };
