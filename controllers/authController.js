import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
  const { name, email, password, perHourCharge, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).render('register', { error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      perHourCharge,
      role: role || 'user'
    });

    await newUser.save();

    res.redirect('/login');
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).render('register', { error: 'Server error' });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).render('login', { error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).render('login', { error: 'Invalid credentials' });
    }

    req.session.userId = user._id;

    req.session.save((err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).render('login', { error: 'Session error' });
      }

      console.log(req.session.userId);
      res.redirect('/dashboard');
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).render('login', { error: 'Server error' });
  }
};




export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err.message);
      return res.status(500).json({ message: 'Logout failed' });
    }

    res.clearCookie('connect.sid'); 
    res.redirect('/login');
  });
};


export const viewUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


export const editUserProfile = async (req, res) => {
  try {
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser)
      return res.status(404).json({ message: 'User not found' });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


export const removeUserProfile = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user.userId);

    if (!deletedUser)
      return res.status(404).json({ message: 'User not found' });

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'User deleted successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
