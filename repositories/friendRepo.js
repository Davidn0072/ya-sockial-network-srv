import Friend from '../models/friendModel.js';
import mongoose from 'mongoose';
/*// Get All
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
*/
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
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId }
        ]
    }).lean();
};

const createFriendRequest = (fromUserId, toUserId) => {
    return Friend.create({ fromUserId, toUserId, status: "pending" });
};
/*
const getRequestsByUserIdStatusRole = (userId, status) => {
    return Friend.find({ $or: [{ fromUserId: userId }, { toUserId: userId }], status: status });
};*/

const getRequestsByUserIdStatusRole_OLD = async ({ userId, status, role }) => {
    const query = {};

    if (status) {
        query.status = status;
    }

    console.log("getRequestsByUserIdStatusRole1: " + userId + " " + status + " " + role);
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

    console.log("getRequestsByUserIdStatusRole2: " + JSON.stringify(query));

    let mongoQuery = Friend.find(query);

    if (role === "from") {
        //console.log("getRequestsByUserIdStatusRole3: from");
        mongoQuery = mongoQuery.populate("toUserId", "name").lean();
    } else if (role === "to") {
        //console.log("getRequestsByUserIdStatusRole3: to");
        mongoQuery = mongoQuery.populate("fromUserId", "name").lean();
    } else {
        //console.log("getRequestsByUserIdStatusRole3: all");
        mongoQuery = mongoQuery
            .populate("fromUserId", "name")
            .populate("toUserId", "name").lean();
    }

    return mongoQuery;
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

    if (options.sort) mongoQuery = mongoQuery.sort(options.sort);
    if (options.limit) mongoQuery = mongoQuery.limit(options.limit);
    if (options.skip) mongoQuery = mongoQuery.skip(options.skip);

    return mongoQuery;
};

export {
    createFriendRequest, findFriendRequestByFromAndToUserId, getRequestsByUserIdStatusRole, getFriendRequestById, updateFriendRequestStatus, deleteFriendRequest, getFriends, deleteManyFriends
};
