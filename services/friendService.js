import * as friendRepo from '../repositories/friendRepo.js';

// Get All
const getAllFriends = (queries) => {
    return friendRepo.getAllFriends(queries);
};

// Get By ID
const getFriendById = (id) => {
    return friendRepo.getFriendById(id);
};

// Create
const addFriend = (obj) => {
    return friendRepo.addFriend(obj);
};

// Update
const updateFriend = (id, obj) => {
    return friendRepo.updateFriend(id, obj);
};

// Delete
const deleteFriend = (id) => {
    return friendRepo.deleteFriend(id);
};

// Delete many records
const deleteManyFriends = (query) => {
    return friendRepo.deleteManyFriends(query);
};

export { getAllFriends, getFriendById, addFriend, updateFriend, deleteFriend, deleteManyFriends };
