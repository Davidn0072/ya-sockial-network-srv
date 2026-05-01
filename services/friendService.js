import * as friendRepo from '../repositories/friendRepo.js';
import { buildPagination, buildCursorResponse } from "../utils/pagination.js";
import { AppError } from '../errors/AppError.js';

// Delete many friends
const deleteManyFriends = (query) => {
    return friendRepo.deleteManyFriends(query);
};

// Delete a friend request
const deleteFriendRequest = (id) => {
    return friendRepo.deleteFriendRequest(id);
};

// Find a friend request by from and to user ID
const findFriendRequestByFromAndToUserId = async (fromUserId, toUserId) => {
    if (fromUserId === toUserId) {
        throw new AppError("Cannot send request to yourself", 400);
    }

    const existing = await friendRepo.findFriendRequestByFromAndToUserId(fromUserId, toUserId);

    return existing
};

// Create a friend request
const createFriendRequest = async (fromUserId, toUserId) => {
    return friendRepo.createFriendRequest(fromUserId, toUserId);
};

const sendFriendRequest = async (fromUserId, toUserId) => {
    if (fromUserId === toUserId) {
        throw new AppError("Cannot send request to yourself", 400);
    }

    const existing = await friendRepo.findFriendRequestByFromAndToUserId(
        fromUserId,
        toUserId
    );

    if (existing) {
        throw new AppError("Friend request already exists", 400);
    }

    return friendRepo.createFriendRequest(fromUserId, toUserId);
};

const getIncomingRequests = async (userId) => {
    return friendRepo.getIncomingRequests(userId);
};

const acceptRequest = async (requestId, userId) => {
    const request = await friendRepo.getFriendRequestById(requestId);

    if (!request) throw new AppError("Request not found", 404);

    if (request.toUserId.toString() !== userId) {
        throw new AppError("Not authorized", 401);
    }

    if (request.status !== "pending") {
        throw new AppError("Already handled", 400);
    }

    return friendRepo.updateFriendRequestStatus(requestId, "accepted");
};

const rejectRequest = async (requestId, userId) => {
    const request = await friendRepo.getFriendRequestById(requestId);

    if (!request) throw new AppError("Request not found", 404);

    if (request.toUserId.toString() !== userId) {
        throw new AppError("Not authorized", 401);
    }

    if (request.status !== "pending") {
        throw new AppError("Already handled", 400);
    }

    return friendRepo.updateFriendRequestStatus(requestId, "rejected");
};

const unfriend = async (id, userId, otherUserId) => {
    //console.log("unfriend1: " + userId + " " + otherUserId);
    const relation = await friendRepo.getRequestsByUserIdStatusRole(userId, otherUserId, "");
    //console.log("unfriend2: " + relation);
    if (!relation) {
        throw new AppError("Not friends", 400);
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