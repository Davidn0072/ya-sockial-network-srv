import mongoose from 'mongoose';

const uploadFileSchema = mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
        originalFileName: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { versionKey: false, timestamps: true }
);

const UploadFile = mongoose.model('UploadFile', uploadFileSchema, 'uploadFiles');

export default UploadFile;