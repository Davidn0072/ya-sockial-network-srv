import * as loginRepo from '../repositories/loginHsitoryRepo.js';

// Get All
const getAllLoginHistory = (queries) => {
    return loginRepo.getAllLoginHistory(queries);
};

// Get By ID
const getLoginHistoryById = (id) => {
    return loginRepo.getLoginHistoryById(id);
};

// Create
const addLoginHistory = (obj) => {
    return loginRepo.addLoginHistory(obj);
};

// Update
const updateLoginHistory = (id, obj) => {
    return loginRepo.updateLoginHistory(id, obj);
};

// Delete
const deleteLoginHistory = (id) => {
    return loginRepo.deleteLoginHistory(id);
};

// Delete many records
const deleteManyLoginHistory = (query) => {
    return loginRepo.deleteManyLoginHistory(query);
};

export { getAllLoginHistory, getLoginHistoryById, addLoginHistory, updateLoginHistory, deleteLoginHistory, deleteManyLoginHistory };
