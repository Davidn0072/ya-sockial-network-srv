import * as userRepo from '../repositories/userRepo.js';
import { getPostByFieldId, deletePost } from '../services/postService.js';
import { deleteManyFriends } from '../services/friendService.js';
import { deleteManyLoginHistory } from './loginHistoryService.js';



// Get All
const getAllUsers = (queries) => {
    return userRepo.getAllUsers(queries);
};

// Get By ID
const getUserById = (id) => {
    return userRepo.getUserById(id);
};

// Create
const addUser = (obj) => {
    return userRepo.addUser(obj);
};

// Update
const updateUser = (id, obj) => {
    return userRepo.updateUser(id, obj);
};

// Delete
const deleteUser = async (id) => {
    //console.log("User-before delete-0:" + id);
    const user = await getUserById(id);
    //console.log("User-after getUserById-0:" + user);

    if (!user) {
        return res.status(404).send('User not found');
    }
    // console.log("User-before delete-1:" + id);
    const userPosts = await getPostByFieldId({ userId: id });
    //console.log("User-after getPostById-1:" + userPosts);
    const postIds = userPosts.map(p => p.id);
    //console.log("User-before delete-2:" + postIds);

    await Promise.all(postIds.map(id => deletePost(id)));

    //console.log("User-after delete-3:" + postIds);
    //console.log("User-before delete-3:" + id);

    await Promise.all([
        deleteManyFriends({ userId: id }),
        deleteManyLoginHistory({ userId: id })
    ]);

    return await userRepo.deleteUser(id);
};

const getUserByEmailAndPassword = (email, password) => {
    return userRepo.getUserByEmailAndPassword(email, password);
};
const isNameExists = (name) => {
    return userRepo.isNameExists(name);
};
const isEmailExists = (email) => {
    return userRepo.isEmailExists(email);
};
const findOneByField = (field) => {//case insensitive search
    return userRepo.findOneByField(field);
};

async function register({ name, email, password, confirmPassword }) {

    //console.log("register: " + name + " " + email + " " + password + " " + confirmPassword + " " + (password === confirmPassword));

    const isNameExists = await findOneByField({ name: name });
    if (isNameExists) {
        throw new Error('Name already exists');
    }

    const isEmailExists = await findOneByField({ email: email });
    if (isEmailExists) {
        throw new Error('Email already exists');
    }

    if (password !== confirmPassword) {
        throw new Error('Password and confirm password do not match');
    }

    const newUser = await addUser({ name, email, password });
    return newUser;
}

const searchUsersByName = async (search) => {
    return userRepo.searchUsersByName(search);
};
export { getAllUsers, getUserById, addUser, updateUser, deleteUser, getUserByEmailAndPassword, isNameExists, isEmailExists, findOneByField, register, searchUsersByName };
