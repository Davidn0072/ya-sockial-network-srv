import * as postRepo from '../repositories/postRepo.js';
import { deleteManyLikes, getAllLikesGroupByType } from '../services/likesService.js';
import { deleteManyComments, getAllCommentsPaged, countCommentsByPostId } from '../services/commentsService.js';
import { deleteManyDBUploadFiles, getAllDBUploadFiles, getAllDBUploadFilesPaged, countDBUploadFilesByPostId } from '../services/dbUploadFilesService.js';
import { deletePostFolder } from '../repositories/storageUploadFileRepo.js';
import { buildPagination, buildCursorResponse } from "../utils/pagination.js";
import { getRecommendedPostIds } from '../services/postRecommendation.service.js';
import { getUserDomainOfInterest } from '../services/userService.js';
import { AppError } from '../errors/AppError.js';

const validatePostContent = (content) => {
    if (!content || typeof content !== 'string') {
        throw new AppError("Content is required and must be a string", 400);
    }
    const trimmed = content.trim();
    if (trimmed.length < 3) {
        throw new AppError("Content must be at least 3 characters", 400);
    }
    if (trimmed.length > 1000) {
        throw new AppError("Content cannot exceed 1000 characters", 400);
    }
    return trimmed;
};

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

    const truncatedPosts = await Promise.all(posts.map(async (post) => {
        const postObj = post.toObject ? post.toObject() : post;
        const content = postObj.content || '';
        const isLonger = content.length > 120;

        const commentsCount = await countCommentsByPostId(postObj._id, null);
        const likesStats = await getAllLikesGroupByType({ targetId: postObj._id, targetType: 'post' });
        const filesCount = await countDBUploadFilesByPostId(postObj._id);

        return {
            ...postObj,
            preview: content.slice(0, 120),
            hasMore: isLonger,
            commentsCount,
            likesStats,
            filesCount
        };
    }));

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
    const content = validatePostContent(obj.content);

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
const updatePost = async (id, obj) => {
    if (obj.content !== undefined) {
        obj.content = validatePostContent(obj.content);
    }

    const updatedPost = await postRepo.updatePost(id, obj);
    if (!updatedPost) {
        throw new AppError("Failed to update post", 400);
    }
    return updatedPost;
};

// Delete
const deletePost = async (id) => {
    const post = await getPostById(id);

    if (!post) {
        throw new AppError("Post not found", 404);
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
    const commentCursor = query.commentCursor || null;
    const fileCursor = query.fileCursor || null;

    const post = await postRepo.getPostById(postId);
    if (!post) {
        throw new AppError("Post not found", 404);
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
            const commentObj = comment.toObject ? comment.toObject() : comment;
            return { ...commentObj, likesStats };
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

    const truncatedPosts = recommendedPosts.map(post => {
        const postObj = post.toObject ? post.toObject() : post;
        const content = postObj.content || '';
        const isLonger = content.length > 120;
        return {
            ...postObj,
            preview: content.slice(0, 120),
            hasMore: isLonger
        };
    });
    //console.log("getRecommendedPosts-truncatedPosts:", JSON.stringify(truncatedPosts, null, 2));
    return truncatedPosts;
};

export { getAllPosts, getPostByFieldId, getPostById, addPost, updatePost, deletePost, getPostWithDetails, getRecommendedPosts };
