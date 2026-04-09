import * as loginRepo from '../repositories/loginHsitoryRepo.js';

// Get All
const getAllLoginHistory = (queries) => {
    return loginRepo.getAllLogins(queries);
};

// Get By ID
const getLoginHistoryById = (id) => {
    return loginRepo.getLoginById(id);
};

// Create
const addLoginHistory = (obj) => {
    return loginRepo.addLogin(obj);
};

// Update
const updateLoginHistory = (id, obj) => {
    return loginRepo.updateLogin(id, obj);
};

// Delete
const deleteLoginHistory = (id) => {
    return loginRepo.deleteLogin(id);
};

// Delete many records
const deleteManyLoginHistory = (query) => {
    return loginRepo.deleteManyLogins(query);
};

export { getAllLoginHistory, getLoginHistoryById, addLoginHistory, updateLoginHistory, deleteLoginHistory, deleteManyLoginHistory };
