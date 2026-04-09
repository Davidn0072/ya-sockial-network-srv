import mongoose from 'mongoose';

const loginHistorySchema = mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, enum: ['login', 'logout'], default: 'login' },
        ipAddress: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { versionKey: false, timestamps: true }
);

const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema, 'loginHistory');

export default LoginHistory;