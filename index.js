import express from 'express';
import cors from 'cors';
import connectDB from './Config/database.js';
import userRouter from './routers/userRouter.js';
import postRouter from './routers/postRouter.js';
import loginHistoryRouter from './routers/loginHistoryRouter.js';
import likesRouter from './routers/likesRouter.js';
import friendRouter from './routers/friendRouter.js';
import commentsRouter from './routers/commentsRouter.js';
import uploadfileRouter from './routers/uploadfileRouter.js';
import authRouter from './routers/authRouter.js';
import verifyToken from './routers/verifyTokenRouter.js';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

const app = express();
const port = 3000;

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);

app.use('/users', verifyToken, userRouter);
app.use('/posts', verifyToken, postRouter);
app.use('/login-history', verifyToken, loginHistoryRouter);
app.use('/likes', verifyToken, likesRouter);
app.use('/friends', verifyToken, friendRouter);
app.use('/comments', verifyToken, commentsRouter);
app.use('/uploadfiles', verifyToken, uploadfileRouter);

const chat = io.of('/chat');

chat.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error('No token'));

    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        socket.user = payload;
        next();
    } catch {
        next(new Error('Invalid token'));
    }
});

chat.on('connection', (socket) => {
    console.log('User connected:', socket.user);

    socket.on('chat message', (msg) => {
        chat.emit('chat message', `${msg}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    connectDB();
});