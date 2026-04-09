import LoginHistory from '../models/loginHistoryModel.js';

// Get All
const getAllLoginHistory = (queries) => {
    return LoginHistory.find(queries);
};

// Get By ID
const getLoginHistoryById = (id) => {
    return LoginHistory.findById(id);
};

// Create
const addLoginHistory = (obj) => {
    return LoginHistory.create(obj);
};

// Update
const updateLoginHistory = (id, obj) => {
    return LoginHistory.findByIdAndUpdate(id, obj);
};

// Delete
const deleteLoginHistory = (id) => {
    return LoginHistory.findByIdAndDelete(id);
};

// Delete many records
const deleteManyLoginHistory = (query) => {
    return LoginHistory.deleteMany(query);
};

export { getAllLoginHistory, getLoginHistoryById, addLoginHistory, updateLoginHistory, deleteLoginHistory, deleteManyLoginHistory };
