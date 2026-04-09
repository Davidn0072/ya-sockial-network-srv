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
import verifyTokenRouter from './routers/verifyTokenRouter.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use(verifyTokenRouter);

app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/login-history', loginHistoryRouter);
app.use('/likes', likesRouter);
app.use('/friends', friendRouter);
app.use('/comments', commentsRouter);
app.use('/uploadfiles', uploadfileRouter);

app.listen(port, () => {
    console.log(`Server is running at http://127.0.0.1:${port}`);
    connectDB();
});