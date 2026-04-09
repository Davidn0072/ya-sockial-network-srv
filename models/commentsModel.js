import mongoose from 'mongoose';

const commentsSchema = mongoose.Schema(
    {
        content: { type: String, required: true, minlength: 3, maxlength: 1000 },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    },
    { versionKey: false, timestamps: true }
);

const Comments = mongoose.model('Comments', commentsSchema, 'comments');

export default Comments;
