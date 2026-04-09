import * as postRepo from '../repositories/postRepo.js';
import { deleteManyLikes } from '../repositories/likesRepo.js';
import { deleteManyComments } from '../repositories/commentsRepo.js';
import { deleteManyUploadFiles } from '../repositories/uploadfileDB.Repo.js';

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
        return res.status(404).send('Post not found');
    }
    //console.log("Post-before delete-1:" + id);
    await Promise.all([
        deleteManyLikes({ postId: id }),
        deleteManyComments({ postId: id }),
        deleteManyUploadFiles({ postId: id })
    ]);
    //console.log("Post-after delete-2:" + id);
    return await postRepo.deletePost(id);
};

export { getAllPosts, getPostByFieldId, getPostById, addPost, updatePost, deletePost };
