import User from '../models/userModel.js';

// Get All
const getAllUsers = (queries) => {
    return User.find(queries);
};

// Get By ID
const getUserById = (id) => {
    return User.findById(id);
};

// Create
const addUser = (obj) => {
    return User.create(obj);
};

// Update
const updateUser = (id, obj) => {
    return User.findByIdAndUpdate(id, obj);
};

// Delete
const deleteUser = (id) => {
    return User.findByIdAndDelete(id);
};

const getUserByEmailAndPassword = (email, password) => {
    return User.findOne({ email: email, password: password })
};

const isNameExists = (name) => {
    return User.findOne({ name: name });
};
const isEmailExists = (email) => {
    return User.findOne({ email: email });
};

export { getAllUsers, getUserById, addUser, updateUser, deleteUser, getUserByEmailAndPassword, isNameExists, isEmailExists };
