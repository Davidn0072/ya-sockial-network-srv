import * as postRepo from '../repositories/postRepo.js';
import { deleteManyLikes, getAllLikesGroupByType } from '../services/likesService.js';
import { deleteManyComments, getAllComments } from '../services/commentsService.js';
import { deleteManyDBUploadFiles, getAllDBUploadFiles } from '../services/dbUploadFilesService.js';
import { deletePostFolder } from '../repositories/storageUploadFileRepo.js';
import { buildPagination } from "../utils/pagination.js";
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
    /*
    console.log('getAllPosts-Service: filter:', JSON.stringify(filter, null, 2));
    console.log('getAllPosts-Service: query:', JSON.stringify(query, null, 2));
    console.log('getAllPosts-Service: options:', JSON.stringify(options, null, 2));
    console.log('getAllPosts-Service: search:', JSON.stringify(search, null, 2));
    console.log('getAllPosts-Service: params:', JSON.stringify(params, null, 2));
    */
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

const getRecommendedPosts = async (userId) => {
    //console.log('getRecommendedPosts-Service: userId:', userId);
    const userDomainOfInterest = await getUserDomainOfInterest(userId);
    //console.log('getRecommendedPosts-Service: userDomainOfInterest:', JSON.stringify(userDomainOfInterest, null, 2));
    const posts = await postRepo.getAllPosts({
        query: {
            //  userId: { $ne: userId }
        },
        options: {
            limit: 50
        }
    });
    //console.log('getRecommendedPosts-Service: posts:', JSON.stringify(posts, null, 2));
    /*
    const interests = Array.isArray(userDomainOfInterest?.domainofinterest)
        ? userDomainOfInterest.domainofinterest
        : Object.values(userDomainOfInterest?.domainofinterest || {});
    */
    const interests = userDomainOfInterest?.domainofinterest;
    const ids = await getRecommendedPostIds({ interests: interests || [], posts });
    //console.log('getRecommendedPosts-Service: ids:', JSON.stringify(ids, null, 2));
    const recommendedPosts = await postRepo.getByIds(ids);
    //console.log('getRecommendedPosts-Service: recommendedPosts:', JSON.stringify(recommendedPosts, null, 2));
    return recommendedPosts;
};

export { getAllPosts, getPostByFieldId, getPostById, addPost, updatePost, deletePost, getPostWithDetails, getRecommendedPosts };
