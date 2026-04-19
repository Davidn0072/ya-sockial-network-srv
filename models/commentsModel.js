import mongoose from 'mongoose';

const commentsSchema = new mongoose.Schema(
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
            index: true,
        },

        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
            index: true,
        },

        parentCommentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comments',
            default: null,
            index: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },

        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        versionKey: false,
        timestamps: true, // createdAt + updatedAt
    }
);

commentsSchema.index({ postId: 1, createdAt: -1 });
commentsSchema.index({ postId: 1, parentCommentId: 1 });

const Comments = mongoose.model('Comments', commentsSchema, 'comments');

export default Comments;