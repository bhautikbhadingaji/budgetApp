
import express from 'express';
import { authMiddleware } from '../middleware/authmiddleware.js';
import { register, login} from '../controllers/authController.js';
import {viewUserProfile, editUserProfile, removeUserProfile} from "../controllers/authController.js";
// import authMiddleware from "../middleware/authMiddleware.js";




const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get("/profile/view", authMiddleware, viewUserProfile);
router.put("/profile/edit", authMiddleware, editUserProfile);
router.delete("/profile/remove", authMiddleware, removeUserProfile);

export default router;
