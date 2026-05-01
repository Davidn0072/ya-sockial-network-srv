import * as userService from '../services/userService.js';
import jwt from 'jsonwebtoken';
import * as loginHistoryService from '../services/loginHistoryService.js';
import bcrypt from 'bcrypt';

async function login(email, password, ip) {
    const user = await userService.getUserByEmailAndPassword(email);

    //console.log("user: " + JSON.stringify(user));

    if (!user) {
        const error = new Error('the email and password are not found in the database');
        error.status = 401;
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const error = new Error('the email and password are not found in the database');
        error.status = 401;
        throw error;
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