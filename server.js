import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/database.js';
import incomeRoutes from './routes/incomeRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import authRoutes from './routes/authRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import leaveRoutes from './routes/leave.js';
import workReportRoutes from './routes/workReportRoutes.js';
import payoutRoutes from './routes/payoutRoutes.js';

const app = express();
dotenv.config();
connectDB();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/income', incomeRoutes);
app.use('/expenses', expenseRoutes);
app.use('/', authRoutes); 
app.use('/home', homeRoutes);
app.use('/leave', leaveRoutes);
app.use('/workreports', workReportRoutes);
app.use('/payout', payoutRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to BudgetApp API');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
