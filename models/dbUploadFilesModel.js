import mongoose from 'mongoose';

const dbUploadFilesSchema = mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
        originalFileName: { type: String, required: true },
        storageFileName: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { versionKey: false, timestamps: true }
);

const dbUploadFilesModel = mongoose.model('UploadFiles', dbUploadFilesSchema, 'UploadFiles');

export default dbUploadFilesModel;