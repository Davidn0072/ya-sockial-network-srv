import Friend from '../models/friendModel.js';
import mongoose from 'mongoose';

// Delete
const deleteFriendRequest = (id) => {
    return Friend.findByIdAndDelete(id);
};

// Delete many records
const deleteManyFriends = (query) => {
    return Friend.deleteMany(query);
}

// Get By ID
const getFriendRequestById = (id) => {
    return Friend.findById(id).lean();
};

const findFriendRequestByFromAndToUserId = (fromUserId, toUserId) => {
    return Friend.findOne({
        $or: [
            { fromUserId: fromUserId, toUserId: toUserId },
            { fromUserId: toUserId, toUserId: fromUserId }
        ]
    }).lean();
};

const createFriendRequest = (fromUserId, toUserId) => {
    return Friend.create({ fromUserId, toUserId, status: "pending" });
};

const updateFriendRequestStatus = (requestId, status) => {
    return Friend.findByIdAndUpdate(requestId, { status }, { returnDocument: 'after' });
};

const getFriends = (userId, paginationQuery = {}, options = {}) => {
    const query = {
        $or: [{ fromUserId: userId }, { toUserId: userId }],
        status: "accepted",
        ...paginationQuery
    };

    let mongoQuery = Friend.find(query)
        .populate("fromUserId", "name")
        .populate("toUserId", "name").lean();

    if (options.sort) mongoQuery = mongoQuery.sort(options.sort);
    if (options.limit) mongoQuery = mongoQuery.limit(options.limit);
    if (options.skip) mongoQuery = mongoQuery.skip(options.skip);

    return mongoQuery;
};

const buildFriendQuery = ({ userId, status, role }) => {
    const query = {};

    if (status) {
        query.status = status;
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);

    if (role === "from") {
        query.fromUserId = objectUserId;
    } else if (role === "to") {
        query.toUserId = objectUserId;
    } else {
        query.$or = [
            { fromUserId: objectUserId },
            { toUserId: objectUserId }
        ];
    }

    return query;
};

const buildFriendPopulate = (role) => {
    if (role === "from") {
        return { path: "toUserId", select: "name" };
    }

    if (role === "to") {
        return { path: "fromUserId", select: "name" };
    }

    return [
        { path: "fromUserId", select: "name" },
        { path: "toUserId", select: "name" }
    ];
};

const getRequestsByUserIdStatusRole = async ({ userId, status, role }, paginationQuery = {}, options = {}) => {
    const baseQuery = buildFriendQuery({ userId, status, role });
    const query = { ...baseQuery, ...paginationQuery };
    //console.log("getRequestsByUserIdStatusRole1: " + JSON.stringify(query));
    const populate = buildFriendPopulate(role);
    //console.log("getRequestsByUserIdStatusRole2: " + JSON.stringify(populate));

    let mongoQuery = Friend.find(query).populate(populate).lean();
    //console.log("getRequestsByUserIdStatusRole31: " + JSON.stringify(mongoQuery));
    if (options.sort) mongoQuery = mongoQuery.sort(options.sort);
    if (options.limit) mongoQuery = mongoQuery.limit(options.limit);
    if (options.skip) mongoQuery = mongoQuery.skip(options.skip);

    return mongoQuery;
};

export {
    createFriendRequest, findFriendRequestByFromAndToUserId, getRequestsByUserIdStatusRole, getFriendRequestById, updateFriendRequestStatus, deleteFriendRequest, getFriends, deleteManyFriends
};
