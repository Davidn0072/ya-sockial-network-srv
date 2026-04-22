import * as postRepo from '../repositories/postRepo.js';
import { deleteManyLikes, getAllLikesGroupByType } from '../services/likesService.js';
import { deleteManyComments, getAllComments } from '../services/commentsService.js';
import { deleteManyDBUploadFiles, getAllDBUploadFiles } from '../services/dbUploadFilesService.js';
import { deletePostFolder } from '../repositories/storageUploadFileRepo.js';
import { buildPagination } from "../utils/pagination.js";
// Get All
const buildFilter = ({ userId, category }) => {
    const filter = {};

    if (userId) filter.userId = userId;
    if (category) filter.category = category;

    return filter;
};

const getAllPosts = async (params) => {
    const filter = buildFilter(params);
    const { query, options } = buildPagination(params);
    //console.log('getAllPosts-Service: query:', JSON.stringify(query, null, 2));
    //console.log('getAllPosts-Service: filter:', JSON.stringify(filter, null, 2));
    //console.log('getAllPosts-Service: options:', JSON.stringify(options, null, 2));

    const posts = await postRepo.getAllPosts({
        query: {
            ...query,
            ...filter
        },
        options
    });

    const lastPost = posts[posts.length - 1];

    return {
        posts,
        nextCursor: lastPost ? lastPost._id : null
    };
};

// Get By ID
const getPostByFieldId = (queries) => {
    return postRepo.getPostByFieldId(queries);
};

const getPostById = (id) => {
    return postRepo.getPostById(id);
};

// Create
const addPost = (obj) => {
    return postRepo.addPost(obj);
};

// Update
const updatePost = (id, obj) => {
    return postRepo.updatePost(id, obj);
};

// Delete
const deletePost = async (id) => {
    //console.log("Post-before delete-0:" + id);
    const post = await getPostById(id);
    //console.log("Post-after getPostById-0:" + post);

    if (!post) {
        return { error: 'Post not found' };
    }

    await deletePostFolder(id);

    //console.log("Post-before delete-1:" + id);
    await Promise.all([
        deleteManyLikes({ postId: id }),
        deleteManyComments({ postId: id }),
        deleteManyDBUploadFiles({ postId: id })
    ]);
    //console.log("Post-after delete-2:" + id);
    return await postRepo.deletePost(id);
};

const getPostWithDetails = async (postId, query) => {
    const page = Number(query.page) || 1;
    const limit = 10;
    //console.log(postId);
    const post = await postRepo.getPostById(postId);
    //console.log(post);
    if (!post) {
        return { error: 'Post not found' };
    }
    //console.log("error1");
    const comments = await getAllComments({
        postId,
        parentCommentId: null,
        page,
        limit,
        sortDir: -1
    });

    const commentsWithLikes = await Promise.all(
        comments.data.map(async (comment) => {
            const likesStats = await getAllLikesGroupByType({ targetId: comment._id });
            return { ...comment.toObject(), likesStats };
        })
    );
    /*
        console.log('comments:', JSON.stringify(comments, null, 2));
        console.log('--------------------------------');
        console.log('commentsWithLikes:', JSON.stringify(commentsWithLikes, null, 2));
    */
    const files = await getAllDBUploadFiles({ postId });
    //console.log(files);
    const likesStats = await getAllLikesGroupByType({ targetId: postId });

    //console.log('getPostWithDetails-likesStats:', JSON.stringify(likesStats, null, 2));

    return {
        post,
        comments: commentsWithLikes,
        //comments,
        files,
        likesStats,
        pagination: {
            page,
            hasMore: comments.hasMore
        }
    };
};

export { getAllPosts, getPostByFieldId, getPostById, addPost, updatePost, deletePost, getPostWithDetails };
