import * as postRepo from '../repositories/postRepo.js';
import { deleteManyLikes, getAllLikesGroupByType } from '../services/likesService.js';
import { deleteManyComments, getAllCommentsPaged, countCommentsByPostId } from '../services/commentsService.js';
import { deleteManyDBUploadFiles, getAllDBUploadFilesPaged, countDBUploadFilesByPostId } from '../services/dbUploadFilesService.js';
import { deletePostFolder } from '../repositories/storageUploadFileRepo.js';
import { buildPagination, buildCursorResponse } from "../utils/pagination.js";
import { getRecommendedPostIds } from '../services/postRecommendation.service.js';
import { getUserDomainOfInterest } from '../services/userService.js';
import { AppError } from '../errors/AppError.js';
import { validateContent } from '../utils/validators.js';

const escapeRegex = (str) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Get All
const buildFilter = ({ userId, category }) => {
    const filter = {};
    if (userId) filter.userId = userId;
    if (category) filter.category = category;
    return filter;
};

const enrichPostsWithDetails = async (posts) => {
    return Promise.all(posts.map(async (post) => {
        const postObj = post.toObject ? post.toObject() : post;
        const commentsCount = await countCommentsByPostId(postObj._id, null);
        const likesStats = await getAllLikesGroupByType({ targetId: postObj._id, targetType: 'post' });
        const filesCount = await countDBUploadFilesByPostId(postObj._id);

        return {
            ...postObj,
            commentsCount,
            likesStats,
            filesCount
        };
    }));
};

const truncatePostsContent = (posts, limit = 120) => {
    return posts.map(post => {
        const content = post.content || '';
        const isLonger = content.length > limit;
        return {
            ...post,
            content: content.slice(0, limit),
            hasMore: isLonger
        };
    });
};

const getAllPosts = async (params) => {
    const filter = buildFilter(params);
    const { search } = params;
    const { query, options } = buildPagination(params);

    if (search) {
        const escapedSearch = escapeRegex(search);
        filter.content = { $regex: escapedSearch, $options: 'i' };
    }

    const posts = await postRepo.getAllPosts({
        query: {
            ...query,
            ...filter
        },
        options
    });

    const enrichedPosts = await enrichPostsWithDetails(posts);
    const truncatedPosts = truncatePostsContent(enrichedPosts);

    const response = buildCursorResponse({ posts: truncatedPosts });
    //console.log("response:", JSON.stringify(response, null, 2));
    return response;
};

// Get By ID
const getPostByFieldId = async (queries) => {
    const post = await postRepo.getPostByFieldId(queries);
    if (!post) {
        throw new AppError("Post not found", 404);
    }
    return post;
};

const getPostById = async (id) => {
    const post = await postRepo.getPostById(id);
    if (!post) {
        throw new AppError("Post not found", 404);
    }
    return post;
};

// Create
const addPost = async (obj) => {
    const content = validateContent(obj.content);

    if (!obj.userId) {
        throw new AppError("UserId is required", 400);
    }

    const newPost = await postRepo.addPost({ ...obj, content });
    if (!newPost) {
        throw new AppError("Failed to create post", 400);
    }
    return newPost;
};

// Update
const updatePost = async (id, userId, obj) => {
    const post = await getPostById(id);

    if (post.userId._id.toString() !== userId) {
        throw new AppError("You can only update your own posts", 403);
    }

    if (obj.content !== undefined) {
        obj.content = validateContent(obj.content);
    }

    const updatedPost = await postRepo.updatePost(id, obj);
    if (!updatedPost) {
        throw new AppError("Failed to update post", 400);
    }
    return updatedPost;
};

// Delete
const deletePost = async (id, userId) => {
    const post = await getPostById(id);

    if (!post) {
        throw new AppError("Post not found", 404);
    }

    if (post.userId._id.toString() !== userId) {
        throw new AppError("You can only delete your own posts", 403);
    }

    await deletePostFolder(id);

    await Promise.all([
        deleteManyLikes({ postId: id }),
        deleteManyComments({ postId: id }),
        deleteManyDBUploadFiles({ postId: id })
    ]);

    const deletedPost = await postRepo.deletePost(id);
    if (!deletedPost) {
        throw new AppError("Failed to delete post", 400);
    }
    return deletedPost;
};

const getPostWithDetails = async (postId, query) => {
    const filesLimit = parseInt(query?.filesLimit) || 4;
    const commentsLimit = parseInt(query?.commentsLimit) || 4;

    const post = await postRepo.getPostById(postId);
    if (!post) {
        throw new AppError("Post not found", 404);
    }

    const [enrichedPost] = await enrichPostsWithDetails([post]);

    // Cursor-based pagination for comments
    const commentsResult = await getAllCommentsPaged({
        postId,
        parentCommentId: null,
        cursor: null,
        limit: commentsLimit
    });

    const commentsWithLikes = await Promise.all(
        commentsResult.comments.map(async (comment) => {
            const likesStats = await getAllLikesGroupByType({ targetId: comment._id });
            const commentObj = comment.toObject ? comment.toObject() : comment;
            return { ...commentObj, likesStats };
        })
    );

    const FinalComments = {
        comments: commentsWithLikes,
        nextCursor: commentsResult.nextCursor
    }


    const filesResult = await getAllDBUploadFilesPaged({
        postId,
        cursor: null,
        limit: filesLimit
    });

    return {
        post: enrichedPost,
        comments: FinalComments,
        files: filesResult
    };
};

const getRecommendedPosts = async (userId) => {
    const userDomainOfInterest = await getUserDomainOfInterest(userId);
    if (!userDomainOfInterest) {
        throw new AppError("User domain of interest not found", 404);
    }
    const posts = await postRepo.getAllPosts({
        query: {},
        options: {
            limit: 50
        }
    });
    //console.log("getRecommendedPosts:", JSON.stringify(posts, null, 2));
    const interests = userDomainOfInterest?.domainofinterest;
    const ids = await getRecommendedPostIds({ interests: interests || [], posts });
    //console.log("getRecommendedPosts-ids:", JSON.stringify(ids, null, 2));
    const recommendedPosts = await postRepo.getByIds(ids);
    //console.log("getRecommendedPosts-recommendedPosts:", JSON.stringify(recommendedPosts, null, 2));
    if (!recommendedPosts) {
        throw new AppError("Recommended posts not found", 404);
    }

    const enrichedPosts = await enrichPostsWithDetails(recommendedPosts);
    const truncatedPosts = truncatePostsContent(enrichedPosts);
    //console.log("getRecommendedPosts-truncatedPosts:", JSON.stringify(truncatedPosts, null, 2));

    const response = buildCursorResponse({ posts: truncatedPosts });
    return response;
};

export { getAllPosts, getPostByFieldId, getPostById, addPost, updatePost, deletePost, getPostWithDetails, getRecommendedPosts };
