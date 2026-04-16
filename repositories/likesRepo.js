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

const getAllLikesGroupByStatus = async (queries) => {
    const matchStage = {
        ...queries,
        postId: new mongoose.Types.ObjectId(queries.postId)
    };

    const result = await Likes.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    //console.log("result:", result);

    const formatted = result.reduce((acc, item) => {
        acc[item._id] = item.count;
        console.log("acc:", acc);
        return acc;
    }, {});

    //console.log("formatted:", formatted);

    return {
        liked: 0,
        disliked: 0,
        neutral: 0,
        ...formatted
    };
}


export { getAllLikes, getLikeById, addLike, updateLike, deleteLike, deleteManyLikes, getAllLikesGroupByStatus };
