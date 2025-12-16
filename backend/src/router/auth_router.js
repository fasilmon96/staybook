import express from 'express';
import { checkAuth, login, logout, signup, userAuth } from '../controllers/auth_controller.js';
import { protectRoute } from '../middleware/auth_middleware.js';


const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/check", protectRoute, checkAuth)


export default router;