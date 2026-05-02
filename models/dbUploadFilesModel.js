import mongoose from 'mongoose';

const dbUploadFilesSchema = mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
        originalFileName: { type: String, required: true },
        storageFileName: { type: String, required: true },
    },
    { versionKey: false, timestamps: true }
);

dbUploadFilesSchema.index({ postId: 1 });
dbUploadFilesSchema.index({ userId: 1 });
dbUploadFilesSchema.index({ postId: 1, userId: 1 });

const dbUploadFilesModel = mongoose.model('UploadFiles', dbUploadFilesSchema, 'UploadFiles');

export default dbUploadFilesModel;