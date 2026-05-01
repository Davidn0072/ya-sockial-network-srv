import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import * as userService from '../services/userService.js';
import * as authService from '../services/authService.js';
import verifyTokenMiddleware from '../Middlewares/verifyTokenMiddleware.js';
import { parseError } from '../errors/AppError.js';

const router = express.Router();

// Entry Point: http://localhost:3000/auth
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    //console.log("register: " + name + " " + email + " " + password + " " + confirmPassword);
    const user = await userService.register({ name, email, password, confirmPassword });

    return res.status(200).json({ success: true, message: 'User registered successfully', user });
  } catch (error) {
    const { status, message } = parseError(error);
    res.status(status).json({ message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password, req.ip);

    return res.status(200).json(result);
  } catch (error) {
    const { status, message } = parseError(error);
    res.status(status).json({ message });
  }
});

router.post("/logout", verifyTokenMiddleware, (req, res) => {
  //res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
});

export default router;
