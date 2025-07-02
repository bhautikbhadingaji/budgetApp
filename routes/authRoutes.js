import express from 'express';
import { authMiddleware, guestOnly } from '../middleware/authmiddleware.js';
import { register, login } from '../controllers/authController.js';
import { viewUserProfile, editUserProfile, removeUserProfile } from "../controllers/authController.js";
import { registerSchema, loginSchema } from '../validators/authValidator.js';
import { validate } from '../validators/validate.js';

const router = express.Router();

router.get('/register', guestOnly, (req, res) => {
  res.render('register', { error: null }); 
});

router.get('/login', guestOnly, (req, res) => {
  res.render('login', { error: null }); 
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/dashboard');
    }
    res.clearCookie('connect.sid'); 
    res.redirect('/login');
  });
});

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

router.get("/profile/view", authMiddleware, viewUserProfile);
router.put("/profile/edit", authMiddleware, editUserProfile);
router.delete("/profile/remove", authMiddleware, removeUserProfile);

export default router;
