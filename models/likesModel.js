import mongoose from 'mongoose';

const likesSchema = mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
        status: { type: String, enum: ['liked', 'disliked', 'neutral'], default: 'neutral' },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { versionKey: false, timestamps: true }
);

const Likes = mongoose.model('Likes', likesSchema, 'likes');

export default Likes;

