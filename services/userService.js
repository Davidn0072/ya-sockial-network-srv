import * as userRepo from '../repositories/userRepo.js';
import { getPostByFieldId, deletePost } from '../services/postService.js';
import { deleteManyFriends } from '../services/friendService.js';
import { buildPagination, buildCursorResponse } from "../utils/pagination.js";
import { normalizeEmail } from './emailService.js';
import bcrypt from 'bcrypt';
import { AppError } from '../errors/AppError.js';

const hashPassword = async (password) => {
    return bcrypt.hash(password, 10);
};


// Get All
const getAllUsers = async (queries) => {
    const hasPaging = queries?.skip !== undefined || queries?.limit !== undefined;
    if (!hasPaging) {
        return userRepo.getAllUsers(queries);
    }

    const skip = Math.max(0, Number(queries.skip) || 0);
    const limit = Math.max(1, Number(queries.limit) || 10);

    const users = await userRepo.getUsersPage({
        query: {},
        options: {
            sort: { _id: -1 },
            skip,
            limit
        }
    });

    if (users.length === 0) {
        throw new AppError('No users found', 404);
    }

    return {
        users,
        skip,
        limit,
        hasMore: users.length === limit
    };
};

// Get By ID
const getUserById = async (id) => {
    const user = await userRepo.getUserById(id);
    if (!user) {
        throw new AppError('User not found', 404);
    }
    return user;
};

// Create
const addUser = async (obj) => {
    if (obj.password) {
        obj.password = await hashPassword(obj.password);
    }
    const newUser = await userRepo.addUser(obj);
    if (!newUser) {
        throw new AppError('Failed to create user', 400);
    }
    return newUser;
};

// Update
async function updateUser(userId, data, authenticatedUserId) {
    if (userId !== authenticatedUserId) {
        throw new AppError('You can only update your own profile', 403);
    }

    const { name } = data;
    const email = data.email ? normalizeEmail(data.email) : null;

    if (name) await checkNameUnique(name, userId);
    if (email) validateEmail(email);
    if (email) await checkEmailUnique(email, userId);

    if (data.newPassword) {
        const user = await userRepo.getUserByIdAndPassword(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        const isMatch = await bcrypt.compare(data.oldPassword, user.password);
        if (!isMatch) {
            throw new AppError('Old password is not correct', 400);
        }
        validatePasswordMatch(data.newPassword, data.confirmPassword);
        data.password = await hashPassword(data.newPassword);
        delete data.newPassword;
        delete data.oldPassword;
        delete data.confirmPassword;
    }
    if (email) {
        data.email = email;
    }
    return userRepo.updateUser(userId, data);
}


// Delete
const deleteUser = async (id, authenticatedUserId) => {
    if (id !== authenticatedUserId) {
        throw new AppError('You can only delete your own profile', 403);
    }

    const user = await getUserById(id);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const userPosts = await getPostByFieldId({ userId: id });
    const postIds = userPosts.map(p => p._id);

    await Promise.all(postIds.map(postId => deletePost(postId, id)));

    await Promise.all([
        deleteManyFriends({ userId: id }),
    ]);

    return await userRepo.deleteUser(id);
};

const getUserByEmailAndPassword = (email) => {
    const normalized = normalizeEmail(email);
    return userRepo.getUserByEmailAndPassword(normalized);
};
const isNameExists = (name) => {
    return userRepo.isNameExists(name);
};
const isEmailExists = (email) => {
    const normalized = normalizeEmail(email);
    return userRepo.isEmailExists(normalized);
};

function validatePasswordMatch(password, confirmPassword) {
    if (!password || !confirmPassword) {
        throw new AppError('Password and confirm password are required', 400);
    }
    if (password !== confirmPassword) {
        throw new AppError('Password and confirm password do not match', 400);
    }
}

function validatePassword(password) {
    if (!password || typeof password !== 'string') {
        throw new AppError('Password is required and must be a string', 400);
    }
    if (password.length < 8) {
        throw new AppError('Password must be at least 8 characters', 400);
    }
}

function validateName(name) {
    if (!name || typeof name !== 'string') {
        throw new AppError('Name is required and must be a string', 400);
    }
    const trimmed = name.trim();
    if (trimmed.length < 3) {
        throw new AppError('Name must be at least 3 characters', 400);
    }
    if (trimmed.length > 100) {
        throw new AppError('Name cannot exceed 100 characters', 400);
    }
}

async function register(data) {
    const { name, password, confirmPassword } = data;
    const email = normalizeEmail(data.email);

    validateName(name);
    validateEmail(email);
    validatePassword(password);
    validatePasswordMatch(password, confirmPassword);

    await checkNameUnique(name);
    await checkEmailUnique(email);

    return addUser({ name, email, password });
}

const searchUsersByName = async (params) => {

    const fldSearch = {
        q: params.q
    };

    const paginationParams = {
        limit: params.limit,
        cursor: params.cursor
    };

    const { query, options } = buildPagination(paginationParams);
    const users = await userRepo.searchUsersByName(fldSearch.q, query, options);

    if (users.length === 0) {
        throw new AppError('No users found', 404);
    }

    const response = buildCursorResponse({ users });
    return response;
};

const getUserDomainOfInterest = (userId) => {
    return userRepo.getUserDomainOfInterest(userId);
}
async function checkNameUnique(name, excludeUserId = null) {
    const user = await findOneByField({ name });
    if (user && user._id.toString() !== excludeUserId) {
        throw new AppError('Name already exists', 400);
    }
}

async function checkEmailUnique(email, excludeUserId = null) {
    const normalized = normalizeEmail(email);
    const user = await findOneByField({ email: normalized });

    if (user && user._id.toString() !== excludeUserId) {
        throw new AppError('Email already exists', 400);
    }
}

const findOneByField = (field) => {//case insensitive search
    return userRepo.findOneByField(field);
};

function validateEmail(email) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        throw new AppError('Invalid email address', 400);
    }
}
export { getAllUsers, getUserById, addUser, updateUser, deleteUser, getUserByEmailAndPassword, isNameExists, isEmailExists, findOneByField, register, searchUsersByName, getUserDomainOfInterest, validateEmail, validatePassword, validateName };

