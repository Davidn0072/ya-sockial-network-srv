import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 1000,
            trim: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },

        parentCommentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comments',
            default: null,
        },
    },
    {
        versionKey: false,
        timestamps: true, // createdAt + updatedAt
    }
);

commentSchema.index({ postId: 1, parentCommentId: 1, createdAt: 1 });

const Comment = mongoose.model('Comment', commentSchema, 'comments');

export default Comment;