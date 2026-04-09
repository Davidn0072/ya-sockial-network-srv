import mongoose from 'mongoose';
import User from './models/userModel.js';
import Post from './models/postModel.js';
import connectDB from './Config/database.js';
import LoginHistory from './models/loginHistoryModel.js';
import Likes from './models/likesModel.js';
import Friend from './models/friendModel.js';
import Comments from './models/commentsModel.js';
import UploadFile from './models/uploadfileModel.js';


const seedData = async () => {
    await connectDB();
    await User.deleteMany({});
    await Post.deleteMany({});
    await LoginHistory.deleteMany({});
    await Likes.deleteMany({});
    await Friend.deleteMany({});
    await Comments.deleteMany({});
    await UploadFile.deleteMany({});
    const users = await User.insertMany([
        { name: 'Dan', email: 'dan@test.com', password: '12345671', domainofinterest: ['technology', 'gaming', 'sports'] },
        { name: 'Noa', email: 'noa@test.com', password: '12345672', domainofinterest: ['movies', 'music', 'sports'] },
        { name: 'John', email: 'john@test.com', password: '12345673', domainofinterest: ['technology', 'gaming', 'sports'] },
        { name: 'Jane', email: 'jane@test.com', password: '12345674', domainofinterest: ['movies', 'music', 'sports'] },
    ]);
    const posts = await Post.insertMany([
        { title: 'Post 1', content: 'Content 1', userId: users[0]._id },
        { title: 'Post 2', content: 'Content 2', userId: users[1]._id },
        { title: 'Post 3', content: 'Content 3', userId: users[2]._id },
        { title: 'Post 4', content: 'Content 4', userId: users[3]._id },
    ]);
    const logins = await LoginHistory.insertMany([
        { userId: users[0]._id, createdAt: new Date(), updatedAt: new Date(), ipAddress: '127.80.80.1' },
        { userId: users[1]._id, createdAt: new Date(), updatedAt: new Date(), ipAddress: '127.90.90.1' },
        { userId: users[2]._id, createdAt: new Date(), updatedAt: new Date(), ipAddress: '127.80.80.1' },
        { userId: users[3]._id, createdAt: new Date(), updatedAt: new Date(), ipAddress: '127.90.90.1' },
    ]);
    const likes = await Likes.insertMany([
        { userId: users[0]._id, postId: posts[3]._id, createdAt: new Date(), updatedAt: new Date(), status: 'liked' },
        { userId: users[1]._id, postId: posts[2]._id, createdAt: new Date(), updatedAt: new Date(), status: 'disliked' },
        { userId: users[2]._id, postId: posts[1]._id, createdAt: new Date(), updatedAt: new Date(), status: 'liked' },
        { userId: users[3]._id, postId: posts[0]._id, createdAt: new Date(), updatedAt: new Date(), status: 'disliked' },
    ]);
    const friends = await Friend.insertMany([
        { userId: users[0]._id, friendId: users[3]._id, createdAt: new Date(), updatedAt: new Date(), status: 'accepted' },
        { userId: users[1]._id, friendId: users[2]._id, createdAt: new Date(), updatedAt: new Date(), status: 'rejected' },
        { userId: users[2]._id, friendId: users[1]._id, createdAt: new Date(), updatedAt: new Date(), status: 'accepted' },
        { userId: users[3]._id, friendId: users[0]._id, createdAt: new Date(), updatedAt: new Date(), status: 'rejected' },
    ]);
    const comments = await Comments.insertMany([
        { userId: users[0]._id, postId: posts[3]._id, content: 'Comment 1', createdAt: new Date(), updatedAt: new Date() },
        { userId: users[1]._id, postId: posts[2]._id, content: 'Comment 2', createdAt: new Date(), updatedAt: new Date() },
        { userId: users[2]._id, postId: posts[1]._id, content: 'Comment 3', createdAt: new Date(), updatedAt: new Date() },
        { userId: users[3]._id, postId: posts[0]._id, content: 'Comment 4', createdAt: new Date(), updatedAt: new Date() },
    ]);
    const uploadFiles = await UploadFile.insertMany([
        { userId: users[0]._id, postId: posts[0]._id, originalFileName: 'File1.pdf', createdAt: new Date(), updatedAt: new Date() },
        { userId: users[1]._id, postId: posts[1]._id, originalFileName: 'File2.txt', createdAt: new Date(), updatedAt: new Date() },
        { userId: users[2]._id, postId: posts[2]._id, originalFileName: 'File3.pdf', createdAt: new Date(), updatedAt: new Date() },
        { userId: users[3]._id, postId: posts[3]._id, originalFileName: 'File4.txt', createdAt: new Date(), updatedAt: new Date() },
    ]);
    console.log('Seed done 🌱');
    process.exit();
}

seedData();


//http://localhost:3000/users/?_id=69d629eeb505d80fbd773822
//http://localhost:3000/users/?email=dan@test.com