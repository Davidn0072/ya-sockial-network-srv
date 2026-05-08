import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const mongoURL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/SocialNetworkYA';
        await mongoose.connect(mongoURL);
        console.log("connected to DB");
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1);
    }
};

export default connectDB;