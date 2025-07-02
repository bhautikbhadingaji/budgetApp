import User from '../models/userModel.js';

export const authMiddleware = async (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  try {
    const user = await User.findById(req.session.userId).select('name email role');
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
    console.error('Auth Middleware Error:', error);
    return res.redirect('/login');
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    if (req.session.userId) {
      const user = await User.findById(req.session.userId).select('name email role');
      
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
    } else {
      req.user = null;
    }
  } catch (error) {
    console.error('OptionalAuth Error:', error);
    req.user = null;
  }

  next();
};


export const guestOnly = async (req, res, next) => {
  console.log("Inside guestOnly middleware");
  console.log(req.session.userId);

  if (!req.session.userId) return next();

  try {
    const user = await User.findById(req.session.userId).select('role');
    console.log(user.role);

    if (user) {
      return res.redirect('/dashboard');
    }
  } catch (err) {
    console.error(err);
  }

  next();
};





export const restrictUserRoutes = (req, res, next) => {
  const allowedForUser = ['/dashboard', '/leave', '/workreport', '/logout', '/weekly-report','/weekly-work'];
  const userRole = req.user?.role;

  if (userRole === 'user') {
    const path = req.path.toLowerCase();

    const isAllowed = allowedForUser.some((allowedPath) =>
      path.startsWith(allowedPath)
    );

    if (!isAllowed) {
      return res.status(403).render('login');
    }
  }

  next();
};
