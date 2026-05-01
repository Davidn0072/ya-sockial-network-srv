import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import * as userService from '../services/userService.js';
import * as authService from '../services/authService.js';
import verifyTokenMiddleware from '../Middlewares/verifyTokenMiddleware.js';

const router = express.Router();

// Entry Point: http://localhost:3000/auth
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    //console.log("register: " + name + " " + email + " " + password + " " + confirmPassword);
    const user = await userService.register({ name, email, password, confirmPassword });

    return res.status(200).json({ success: true, message: 'User registered successfully', user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password, req.ip);

    return res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message });
  }
});

router.post("/logout", verifyTokenMiddleware, (req, res) => {

  console.log("logout: " + JSON.stringify(req.user));

  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
});

export default router;
