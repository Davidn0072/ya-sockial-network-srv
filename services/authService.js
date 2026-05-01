import * as userService from '../services/userService.js';
import jwt from 'jsonwebtoken';
import * as loginHistoryService from '../services/loginHistoryService.js';
import bcrypt from 'bcrypt';
import { AppError } from '../utils/error.js';

async function login(email, password, ip) {
    const user = await userService.getUserByEmailAndPassword(email);

    //console.log("user: " + JSON.stringify(user));

    if (!user) {
        throw new AppError('the email and password are not found in the database', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError('the password is incorrect', 401);
    }

    //console.log("user: " + JSON.stringify(user));

    const token = jwt.sign(
        { id: user._id },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
    );

    await loginHistoryService.addLoginHistory({ userId: user._id, ipAddress: ip });

    return { token, userId: user._id, userName: user.name };
}

export { login };