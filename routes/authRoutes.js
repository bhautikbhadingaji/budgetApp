
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { register, login} from '../controllers/authController.js';
import {viewUserProfile, editUserProfile, removeUserProfile} from "../controllers/authController.js";
// import authMiddleware from "../middleware/authMiddleware.js";
import { registerSchema, loginSchema } from '../validators/authValidator.js';
import { validate } from '../validators/validate.js';




const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register'); 
});

router.get('/login', (req, res) => {
  res.render('login'); 
  
});


router.post('/logout', (req, res) => {
  res.clearCookie('token');
 
  res.redirect('/login');
});


router.post('/register',  validate(registerSchema), register);
router.post('/login',  validate(loginSchema), login);
router.get("/profile/view", authMiddleware, viewUserProfile);
router.put("/profile/edit", authMiddleware, editUserProfile);
router.delete("/profile/remove", authMiddleware, removeUserProfile);

export default router;
