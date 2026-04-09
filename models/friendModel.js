import mongoose from 'mongoose';

const friendSchema = mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { versionKey: false, timestamps: true }
);

const Friend = mongoose.model('Friend', friendSchema, 'friends');

export default Friend;
