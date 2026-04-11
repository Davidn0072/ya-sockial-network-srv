import express from 'express';
import cors from 'cors';
import connectDB from './Config/database.js';
import userRouter from './routers/userRouter.js';
import postRouter from './routers/postRouter.js';
import loginHistoryRouter from './routers/loginHistoryRouter.js';
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

const app = express();
const port = 3000;

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);

app.use('/users', verifyTokenMiddleware, userRouter);
app.use('/posts', verifyTokenMiddleware, postRouter);
app.use('/login-history', verifyTokenMiddleware, loginHistoryRouter);
app.use('/likes', verifyTokenMiddleware, likesRouter);
app.use('/friends', verifyTokenMiddleware, friendRouter);
app.use('/comments', verifyTokenMiddleware, commentsRouter);
app.use('/uploadfilesdb', verifyTokenMiddleware, dbUploadFilesRouter);
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
        console.log(socket.userId);
        next();
    } catch {
        next(new Error('Invalid token'));
    }
});

chat.on('connection', (socket) => {
    console.log('User connected:', socket.userId);

    socket.on('chat message', (msg) => {
        chat.emit('chat message', `${msg}`);
    });

    socket.on('join private', ({ targetUserId }) => {
        const room = createRoom(socket.userId, targetUserId);

        socket.join(room);

        console.log(`User ${socket.userId} joined ${room}`);
    });

    socket.on('private message', ({ msg, targetUserId }) => {

        const room = createRoom(socket.userId, targetUserId);
        console.log('emit-room:', room);
        console.log('emit-msg:', msg);
        console.log('emit-msg:' + typeof msg);
        console.log('emit-targetUserId:', targetUserId);
        console.log('emit-socket.userId:', socket.userId);
        console.log('socket.userId:', socket.userId);
        chat.to(room).emit('private message', {
            from: socket.userId,
            msg
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    connectDB();
});