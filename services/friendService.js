import * as friendRepo from '../repositories/friendRepo.js';
import { buildPagination, buildCursorResponse } from "../utils/pagination.js";
import { AppError } from '../errors/AppError.js';
import { getUserById } from '../services/userService.js';

// Delete many friends
const deleteManyFriends = (query) => {
    return friendRepo.deleteManyFriends(query);
};

// Delete a friend request
const deleteFriendRequest = async (id, userId) => {
    const request = await friendRepo.getFriendRequestById(id);

    if (!request) throw new AppError("Friend request not found", 404);

    const isInvolved = request.fromUserId.toString() === userId || request.toUserId.toString() === userId;
    if (!isInvolved) {
        throw new AppError("You are not involved in this friend request", 401);
    }

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

    const user = await getUserById(toUserId);
    if (!user) {
        throw new AppError("The user you are trying to send a friend request to is not found", 404);
    }

    const existing = await friendRepo.findFriendRequestByFromAndToUserId(
        fromUserId,
        toUserId
    );

    if (existing) {
        throw new AppError("A friend request to this user already exists", 400);
    }

    return friendRepo.createFriendRequest(fromUserId, toUserId);
};

const acceptRequest = async (requestId, userId) => {
    const request = await friendRepo.getFriendRequestById(requestId);

    if (!request) throw new AppError("Friend request not found", 404);

    const user = await getUserById(request.toUserId);
    if (!user) {
        throw new AppError("The user you are trying to accept a friend request from is not found", 404);
    }

    if (request.toUserId.toString() !== userId) {
        throw new AppError("You can only accept friend requests sent to you", 401);
    }

    if (request.status !== "pending") {
        throw new AppError("This friend request has already been accepted or rejected", 400);
    }

    return friendRepo.updateFriendRequestStatus(requestId, "accepted");
};

const rejectRequest = async (requestId, userId) => {
    const request = await friendRepo.getFriendRequestById(requestId);

    if (!request) throw new AppError("Friend request not found", 404);

    if (request.toUserId.toString() !== userId) {
        throw new AppError("You can only reject friend requests sent to you", 401);
    }

    const user = await getUserById(request.toUserId);
    if (!user) {
        throw new AppError("The user you are trying to reject a friend request from is not found", 404);
    }

    if (request.status !== "pending") {
        throw new AppError("This friend request has already been accepted or rejected", 400);
    }

    return friendRepo.updateFriendRequestStatus(requestId, "rejected");
};

const getFriends = async (userId, params = {}) => {
    const limit = params.limit || 10;
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

    const response = buildCursorResponse({ friends: mappedFriends }, params.limit);
    return response;
};

const getRequestsByUserIdStatusRole = async (userId, status, role, params = {}) => {

    const limit = params.limit || 10;
    const { query, options } = buildPagination({
        cursor: params.cursor,
        limit: limit
    });

    const friends = await friendRepo.getRequestsByUserIdStatusRole({ userId, status, role }, query, options);
    //console.log("getRequestsByUserIdStatusRole3: " + JSON.stringify(friends));
    const mappedFriends = friends.map(f => {
        const isMe = f.fromUserId._id.toString() === userId.toString();

        const friend = isMe ? f.toUserId : f.fromUserId;

        return {
            _id: f._id.toString(),
            friendId: friend._id.toString(),
            name: friend.name
        };
    });

    const response = buildCursorResponse({ requests: mappedFriends }, limit);
    return response;
};

export { createFriendRequest, deleteFriendRequest, sendFriendRequest, deleteManyFriends, acceptRequest, rejectRequest, getFriends, getRequestsByUserIdStatusRole };