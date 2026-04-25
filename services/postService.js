import * as postRepo from '../repositories/postRepo.js';
import { deleteManyLikes, getAllLikesGroupByType } from '../services/likesService.js';
import { deleteManyComments, getAllCommentsPaged } from '../services/commentsService.js';
import { deleteManyDBUploadFiles, getAllDBUploadFiles, getAllDBUploadFilesPaged } from '../services/dbUploadFilesService.js';
import { deletePostFolder } from '../repositories/storageUploadFileRepo.js';
import { buildPagination, buildCursorResponse } from "../utils/pagination.js";
import { getRecommendedPostIds } from '../services/postRecommendation.service.js';
import { getUserDomainOfInterest } from '../services/userService.js';

// Get All
const buildFilter = ({ userId, category }) => {
    const filter = {};
    if (userId) filter.userId = userId;
    if (category) filter.category = category;
    return filter;
};

const getAllPosts = async (params) => {
    const filter = buildFilter(params);
    const { search } = params;
    const { query, options } = buildPagination(params);

    if (search) {
        filter.content = { $regex: search, $options: 'i' };
    }

    const posts = await postRepo.getAllPosts({
        query: {
            ...query,
            ...filter
        },
        options
    });

    const lastPost = posts[posts.length - 1];

    const response = buildCursorResponse({ posts });
    return response;
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
    const post = await getPostById(id);

    if (!post) {
        return { error: 'Post not found' };
    }

    await deletePostFolder(id);

    await Promise.all([
        deleteManyLikes({ postId: id }),
        deleteManyComments({ postId: id }),
        deleteManyDBUploadFiles({ postId: id })
    ]);

    return await postRepo.deletePost(id);
};

const getPostWithDetails = async (postId, query) => {
    const commentCursor = query.commentCursor || null;
    const fileCursor = query.fileCursor || null;

    const post = await postRepo.getPostById(postId);
    if (!post) {
        return { error: 'Post not found' };
    }

    // Cursor-based pagination for comments
    const commentsResult = await getAllCommentsPaged({
        postId,
        parentCommentId: null,
        cursor: commentCursor,
        limit: 10
    });

    const commentsWithLikes = await Promise.all(
        commentsResult.comments.map(async (comment) => {
            const likesStats = await getAllLikesGroupByType({ targetId: comment._id });
            return { ...comment.toObject(), likesStats };
        })
    );

    // Cursor-based pagination for files
    const filesResult = await getAllDBUploadFilesPaged({
        postId,
        cursor: fileCursor,
        limit: 10
    });

    const likesStats = await getAllLikesGroupByType({ targetId: postId });

    return {
        post,
        comments: commentsWithLikes,
        files: filesResult.files,
        likesStats,
        commentsPagination: {
            nextCursor: commentsResult.nextCursor,
            hasMore: commentsResult.nextCursor !== null
        },
        filesPagination: {
            nextCursor: filesResult.nextCursor,
            hasMore: filesResult.nextCursor !== null
        }
    };
};

const getRecommendedPosts = async (userId) => {
    const userDomainOfInterest = await getUserDomainOfInterest(userId);
    const posts = await postRepo.getAllPosts({
        query: {},
        options: {
            limit: 50
        }
    });

    const interests = userDomainOfInterest?.domainofinterest;
    const ids = await getRecommendedPostIds({ interests: interests || [], posts });
    const recommendedPosts = await postRepo.getByIds(ids);
    return recommendedPosts;
};

export { getAllPosts, getPostByFieldId, getPostById, addPost, updatePost, deletePost, getPostWithDetails, getRecommendedPosts };
