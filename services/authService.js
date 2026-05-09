import * as userService from '../services/userService.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AppError } from '../errors/AppError.js';
import { validateAndNormalizeEmail } from '../utils/emailValidators.js';

async function login(email, password, ip) {
    const normalizedEmail = validateAndNormalizeEmail(email);
    const user = await userService.getUserByEmailAndPassword(normalizedEmail);

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

    return { token, userId: user._id, userName: user.name };
}

export { login };