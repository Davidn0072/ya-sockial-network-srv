import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import jwt from 'jsonwebtoken';
import * as userService from '../services/userService.js';
import * as loginHistoryService from '../services/loginHistoryService.js';

const router = express.Router();

// Entry Point: http://localhost:3000/auth

router.post('/login', async (req, res) => {
  try {
    //console.log(req.body);
    const { email, password } = req.body;
    //console.log(email, password);
    //loginHistoryService.get
    // if 'username' and 'password' are exist and correct in the DB

    const user = await userService.getUserByEmailAndPassword(email, password);
    //console.log(user);
    if (!user) {
      return res.status(401).json({ message: 'the email and password not found in the database' });
    }

    const userId = user._id;
    const SECRET_KEY = process.env.SECRET_KEY;
    const token = jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: '1h' });
    return res.status(200).json({ token, userId: user._id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
