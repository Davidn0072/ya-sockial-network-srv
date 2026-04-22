import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true, minlength: 3, maxlength: 100 },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 8, maxlength: 100 },
        domainofinterest: [String],
    },
    { versionKey: false, timestamps: true } // timestamps מחליף את createdAt ו-updatedAt
);
userSchema.index({ username: 1 });
const User = mongoose.model('User', userSchema, 'users');

export default User;

