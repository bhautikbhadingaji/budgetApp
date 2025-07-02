import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import MongoStore from 'connect-mongo'; 
import methodOverride from 'method-override';

import connectDB from './config/database.js';

import incomeRoutes from './routes/incomeRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import authRoutes from './routes/authRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import leaveRoutes from './routes/leave.js';
import workReportRoutes from './routes/workReportRoutes.js';
import payoutRoutes from './routes/payoutRoutes.js';
import weeklyReportRoutes from './routes/weeklyReportRoutes.js';
import weeklyWorkRoutes from './routes/weeklyWorkRoutes.js';

import {
  authMiddleware,
  guestOnly,
  optionalAuth,
  restrictUserRoutes,
} from './middleware/authmiddleware.js';


dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'key12',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: false,      
      sameSite: 'lax'     
    },
  })
);


app.use(optionalAuth);
app.use(restrictUserRoutes);


app.use('/', authRoutes); 
app.use('/home', guestOnly, homeRoutes);

app.use('/', weeklyReportRoutes);
app.use('/', weeklyWorkRoutes);

app.use('/income', authMiddleware, incomeRoutes);
app.use('/expenses', authMiddleware, expenseRoutes);
app.use('/leave', authMiddleware, leaveRoutes);
app.use('/workreports', authMiddleware, workReportRoutes);
app.use('/payout', authMiddleware, payoutRoutes);


app.get('/dashboard', authMiddleware, (req, res) => {
  res.render('dashboard', { user: req.user });
});

app.get('/', guestOnly, (req, res) => {
  res.render('home');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
