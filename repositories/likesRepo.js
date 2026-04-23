import Likes from '../models/likesModel.js';
import mongoose from 'mongoose';

// Get All
const getAllLikes = (queries) => {
    return Likes.find(queries);
};

// Get By ID
const getLikeById = (id) => {
    return Likes.findById(id);
};

// Create
const addLike = (obj) => {
    return Likes.create(obj);
};

// Update
const updateLike = (id, obj) => {
    return Likes.findByIdAndUpdate(id, obj);
};

// Delete
const deleteLike = (id) => {
    return Likes.findByIdAndDelete(id);
};

// Delete many records
const deleteManyLikes = (query) => {
    return Likes.deleteMany(query);
};

const getAllLikesGroupByType = async (queries) => {
    const matchStage = {
        ...queries,
        targetId: new mongoose.Types.ObjectId(queries.targetId)
    };

    const result = await Likes.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: "$type",
                count: { $sum: 1 }
            }
        }
    ]);

    //console.log("result:", result);

    const formatted = result.reduce((acc, item) => {
        acc[item._id] = item.count;
        //console.log("acc:", acc);
        return acc;
    }, {});

    return {
        total: result.reduce((acc, item) => acc + item.count, 0),
        like: 0,
        love: 0,
        celebrate: 0,
        insightful: 0,
        funny: 0,
        ...formatted
    };
}

const addOrUpdateReaction = async (userId, targetId, targetType, type) => {
    userId = String(userId);
    postId = String(postId);

    const existing = await Likes.findOne({ userId, targetId, targetType });

    //console.log("addOrUpdateReaction-existing:", existing + " userId: " + userId + " postId: " + postId + " type: " + type);

    if (!existing) {
        return Likes.create({ userId, targetId, targetType });
    }

    //console.log("addOrUpdateReaction-existing.type:", existing.type + " type: " + type);

    if (existing.type === type) {
        await Likes.deleteOne({ _id: existing._id });
        return { action: 'deleted' };
    }

    existing.type = type;
    await existing.save();

    //console.log("addOrUpdateReaction-returning:", { action: 'updated', type });

    return { action: 'updated', type };
};

const getLikesByType = async (postId, reactionType, genQuery, options) => {
    const query = {
        targetId: postId
    };

    if (reactionType) {
        query.type = reactionType;
    }

    const finalQuery = { ...genQuery, ...query };

    return await Likes.find(finalQuery)
        .populate('userId', 'name')
        .sort(options.sort)
        .skip(options.skip || 0)
        .limit(options.limit);
};

const countLikesByType = async ({ targetId, type }) => {
    const query = { targetId };
    if (type) query.type = type;
    return await Likes.countDocuments(query);
};

const getLikeByUserIdAndTargetIdAndTargetType = async ({ userId, targetId, targetType }) => {
    return await Likes.findOne({ userId, targetId, targetType });
};

export { getAllLikes, getLikeById, addLike, updateLike, deleteLike, deleteManyLikes, getAllLikesGroupByType, addOrUpdateReaction, getLikesByType, countLikesByType, getLikeByUserIdAndTargetIdAndTargetType };
