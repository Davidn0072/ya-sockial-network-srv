import mongoose from 'mongoose';

const likesSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
        type: {
            type: String,
            enum: ['like', 'love', 'celebrate', 'insightful', 'funny'],
            default: 'like'
        }
    },
    { timestamps: true }
);

likesSchema.index({ userId: 1, postId: 1 }, { unique: true });

const Likes = mongoose.model('Likes', likesSchema, 'likes');

export default Likes;


