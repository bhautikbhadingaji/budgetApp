
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import incomeRoutes from './routes/incomeRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
dotenv.config();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/income', incomeRoutes);
app.use('/expenses', expenseRoutes);
app.use('/', authRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to BudgetApp API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


