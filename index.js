import dotenv from 'dotenv';
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['SECRET_KEY', 'DB_URL'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Error: ${envVar} is not set in .env file`);
        process.exit(1);
    }
}

import express from 'express';
import cors from 'cors';
import connectDB from './Config/database.js';
import userRouter from './routers/userRouter.js';
import postRouter from './routers/postRouter.js';
import likesRouter from './routers/likesRouter.js';
import friendRouter from './routers/friendRouter.js';
import commentsRouter from './routers/commentsRouter.js';
import dbUploadFilesRouter from './routers/dbUploadFilesRouter.js';
import authRouter from './routers/authRouter.js';
import verifyTokenMiddleware from './Middlewares/verifyTokenMiddleware.js';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import storageUploadFileRouter from './routers/storageUploadFileRouter.js';
import { getUserById } from './services/userService.js';

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);

app.use('/users', verifyTokenMiddleware, userRouter);
app.use('/posts', verifyTokenMiddleware, postRouter);
app.use('/likes', verifyTokenMiddleware, likesRouter);
app.use('/friends', verifyTokenMiddleware, friendRouter);
app.use('/comments', verifyTokenMiddleware, commentsRouter);
app.use('/uploadfilesdb', verifyTokenMiddleware, dbUploadFilesRouter);
app.use('/uploads', express.static('uploads'));//for view img files in browser
app.use('/upload', verifyTokenMiddleware, storageUploadFileRouter);

const chat = io.of('/chat');

function createRoom(user1, user2) {
    return [user1, user2].sort().join('_');
}

chat.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error('No token'));

    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        socket.userId = payload.id;
        //  console.log(socket.userId);
        next();
    } catch {
        next(new Error('Invalid token'));
    }
});

async function verifyUser(socket) {
    const now = Date.now();
    //console.log('verifyUser')

    if (!socket.lastVerified || now - socket.lastVerified > 300000) {
        try {
            jwt.verify(socket.handshake.auth.token, process.env.SECRET_KEY);
            const user = await getUserById(socket.userId);
            if (!user) {
                socket.emit('error', { message: 'User not found' });
                socket.disconnect();
                return false;
            }
            socket.lastVerified = now;
        } catch (error) {
            socket.emit('error', { message: 'Authentication failed' });
            socket.disconnect();
            return false;
        }
    }
    return true;
}

chat.on('connection', async (socket) => {
    //console.log('User connected:', socket.userId);
    try {
        const user = await getUserById(socket.userId);
        if (!user) {
            socket.emit('error', { message: 'User not found' });
            socket.disconnect();
            return;
        }
        socket.userName = user.name;
    } catch (error) {
        socket.emit('error', { message: 'User not found' });
        socket.disconnect();
        return;
    }

    socket.join('public');

    socket.on('chat message', async (msg) => {
        if (!msg || msg.trim() === '') {
            return;
        }
        if (!(await verifyUser(socket))) {
            return;
        }
        try {
            chat.to('public').emit('chat message', {
                from: socket.userName,
                msg: msg,
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Chat message error:', error.message);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    socket.on('join private', async ({ targetUserId }) => {
        if (!(await verifyUser(socket))) {
            return;
        }
        if (!targetUserId || targetUserId === socket.userId) {
            return socket.emit('error', { message: 'Invalid target user' });
        }
        const targetUser = await getUserById(targetUserId);
        if (!targetUser) {
            return socket.emit('error', { message: 'User not found' });
        }
        const room = createRoom(socket.userId, targetUserId);
        socket.join(room);
    });

    socket.on('private message', async ({ msg, targetUserId }) => {
        if (!msg || msg.trim() === '') {
            return;
        }
        if (!(await verifyUser(socket))) {
            return;
        }
        try {
            if (!targetUserId || typeof targetUserId !== 'string') {
                return socket.emit('error', { message: 'Invalid target' });
            }
            const room = createRoom(socket.userId, targetUserId);
            chat.to(room).emit('private message', {
                from: socket.userName,
                msg
            });
        } catch (error) {
            console.error('Private message error:', error.message);
            socket.emit('error', { message: 'Failed to send private message' });
        }
    });

    socket.on('disconnect', () => {
        socket.rooms.forEach(room => socket.leave(room));
        //console.log('User disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    connectDB();
});