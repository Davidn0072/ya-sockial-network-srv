import mongoose from 'mongoose';

const likesSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    targetType: {
        type: String,
        enum: ['post', 'comment', 'reply'],
        required: true
    },

    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    type: {
        type: String,
        enum: ['like', 'love', 'celebrate', 'insightful', 'funny'],
        default: 'like'
    }
}, { timestamps: true, versionKey: false });

likesSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });
likesSchema.index({ targetType: 1, targetId: 1 });
likesSchema.index({ userId: 1 });
likesSchema.index({ targetType: 1, targetId: 1, type: 1 });

const Likes = mongoose.model('Likes', likesSchema, 'likes');

export default Likes;