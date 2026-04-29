import mongoose from 'mongoose';

const postSchema = mongoose.Schema(
    {
        content: { type: String, required: true, minlength: 3, maxlength: 1000 },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { versionKey: false, timestamps: true }
);

postSchema.index({ userId: 1, createdAt: -1 });
const Post = mongoose.model('Post', postSchema, 'posts');

export default Post;