import Friend from '../models/friendModel.js';

// Get All
const getAllFriends = (queries) => {
    return Friend.find(queries);
};

// Get By ID
const getFriendById = (id) => {
    return Friend.findById(id);
};

// Create
const addFriend = (obj) => {
    return Friend.create(obj);
};

// Update
const updateFriend = (id, obj) => {
    return Friend.findByIdAndUpdate(id, obj);
};

// Delete
const deleteFriend = (id) => {
    return Friend.findByIdAndDelete(id);
};

// Delete many records
const deleteManyFriends = (query) => {
    return Friend.deleteMany(query);
};

export { getAllFriends, getFriendById, addFriend, updateFriend, deleteFriend, deleteManyFriends };
