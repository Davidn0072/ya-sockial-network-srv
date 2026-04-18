import * as postRepo from '../repositories/postRepo.js';
import { deleteManyLikes, getAllLikesGroupByType } from '../services/likesService.js';
import { deleteManyComments, getAllComments } from '../services/commentsService.js';
import { deleteManyDBUploadFiles, getAllDBUploadFiles } from '../services/dbUploadFilesService.js';
import { deletePostFolder } from '../repositories/storageUploadFileRepo.js';

// Get All
const getAllPosts = (queries) => {
    return postRepo.getAllPosts(queries);
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
        page,
        limit
    });
    //console.log(comments);
    const files = await getAllDBUploadFiles({ postId });
    //console.log(files);
    const likesStats = await getAllLikesGroupByType({ postId });
    //console.log('getPostWithDetails-likesStats:', likesStats);
    return {
        post,
        comments,
        files,
        likesStats,
        pagination: {
            page,
            hasMore: comments.hasMore
        }
    };
};

export { getAllPosts, getPostByFieldId, getPostById, addPost, updatePost, deletePost, getPostWithDetails };
