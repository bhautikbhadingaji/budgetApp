import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');

  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('name email role');

    if (!user) {
      return res.redirect('/login');
    }

    req.user = {
      userId: user._id,
      username: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.redirect('/login');
  }
};


export const optionalAuth = async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('name email role');

      if (user) {
        req.user = {
          userId: user._id,
          username: user.name,
          email: user.email,
          role: user.role,
        };
      } else {
        req.user = null;
      }
    } catch (error) {
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
};


export const guestOnly = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (user) {
      return res.redirect('/dashboard'); 
    } else {
      return next();
    }
  } catch (err) {
    return next(); 
  }
};

export const restrictUserRoutes = (req, res, next) => {
  const allowedForUser = ['/dashboard', '/leave', '/workreport','/logout','/weekly-report'];
  const userRole = req.user?.role;

  if (userRole === 'user') {
    const path = req.path.toLowerCase();

    const isAllowed = allowedForUser.some((allowedPath) =>
      path.startsWith(allowedPath)
    );

    if (!isAllowed) {
      return res.status(403).render('login', {
      });
    }
  }

  next();
};

