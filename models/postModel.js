import mongoose from 'mongoose';

const postSchema = mongoose.Schema(
    {
        title: { type: String, required: true, minlength: 3, maxlength: 100 },
        content: { type: String, required: true, minlength: 3, maxlength: 1000 },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { versionKey: false, timestamps: true }
);

const Post = mongoose.model('Post', postSchema, 'posts');

export default Post;