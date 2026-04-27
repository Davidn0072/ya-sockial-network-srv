import * as friendRepo from '../repositories/friendRepo.js';
import { buildPagination, buildCursorResponse } from "../utils/pagination.js";
/*
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

*/
// Delete many records
const deleteManyFriends = (query) => {
    return friendRepo.deleteManyFriends(query);
};

const deleteFriendRequest = (id) => {
    return friendRepo.deleteFriendRequest(id);
};

const findFriendRequestByFromAndToUserId = async (fromUserId, toUserId) => {
    if (fromUserId === toUserId) {
        throw new Error("Cannot send request to yourself");
    }

    const existing = await friendRepo.findFriendRequestByFromAndToUserId(fromUserId, toUserId);

    return existing
};

const createFriendRequest = async (fromUserId, toUserId) => {
    return friendRepo.createFriendRequest(fromUserId, toUserId);
};

const sendFriendRequest = async (fromUserId, toUserId) => {
    if (fromUserId === toUserId) {
        throw new Error("Cannot send request to yourself");
    }

    const existing = await friendRepo.findFriendRequestByFromAndToUserId(
        fromUserId,
        toUserId
    );

    if (existing) {
        throw new Error("Friend request already exists");
    }

    return friendRepo.createFriendRequest(fromUserId, toUserId);
};

const getIncomingRequests = async (userId) => {
    return friendRepo.getIncomingRequests(userId);
};

const acceptRequest = async (requestId, userId) => {
    const request = await friendRepo.getFriendRequestById(requestId);

    if (!request) throw new Error("Request not found");

    if (request.toUserId.toString() !== userId) {
        throw new Error("Not authorized");
    }

    if (request.status !== "pending") {
        throw new Error("Already handled");
    }

    return friendRepo.updateFriendRequestStatus(requestId, "accepted");
};

const rejectRequest = async (requestId, userId) => {
    const request = await friendRepo.getFriendRequestById(requestId);

    if (!request) throw new Error("Request not found");

    if (request.toUserId.toString() !== userId) {
        throw new Error("Not authorized");
    }

    if (request.status !== "pending") {
        throw new Error("Already handled");
    }

    return friendRepo.updateFriendRequestStatus(requestId, "rejected");
};

const unfriend = async (id, userId, otherUserId) => {
    //console.log("unfriend1: " + userId + " " + otherUserId);
    const relation = await friendRepo.getRequestsByUserIdStatusRole(userId, otherUserId, "");
    //console.log("unfriend2: " + relation);
    if (!relation) {
        throw new Error("Not friends");
    }

    return friendRepo.deleteFriendRequest(relation._id);
};

const getFriends = async (userId, params = {}) => {
    const { query, options } = buildPagination(params);

    const friends = await friendRepo.getFriends(userId, query, options);

    const mappedFriends = friends.map(f => {
        const isMe = f.fromUserId._id.toString() === userId.toString();

        const friend = isMe ? f.toUserId : f.fromUserId;

        return {
            _id: f._id.toString(),
            friendId: friend._id.toString(),
            name: friend.name
        };
    });

    const response = buildCursorResponse({ friends: mappedFriends });
    return response;
};

const getRequestsByUserIdStatusRole_OLD = async (userId, status, role) => {
    return friendRepo.getRequestsByUserIdStatusRole({ userId, status, role });
};

const getRequestsByUserIdStatusRole = async (userId, status, role, params = {}) => {
    const { query, options } = buildPagination(params);

    const friends = await friendRepo.getRequestsByUserIdStatusRole({ userId, status, role }, query, options);

    const mappedFriends = friends.map(f => {
        const isMe = f.fromUserId._id.toString() === userId.toString();

        const friend = isMe ? f.toUserId : f.fromUserId;

        return {
            _id: f._id.toString(),
            friendId: friend._id.toString(),
            name: friend.name
        };
    });

    const response = buildCursorResponse({ requests: mappedFriends });
    return response;
};

export { createFriendRequest, deleteFriendRequest, sendFriendRequest, deleteManyFriends, findFriendRequestByFromAndToUserId, getIncomingRequests, acceptRequest, rejectRequest, getFriends, getRequestsByUserIdStatusRole };