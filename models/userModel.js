import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true, minlength: 3, maxlength: 100 },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 8, maxlength: 100, select: false },
        domainofinterest: [String],
    },
    { versionKey: false, timestamps: true }
);

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.index({ username: 1 });

// Remove password from the response
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

const User = mongoose.model('User', userSchema, 'users');

export default User;