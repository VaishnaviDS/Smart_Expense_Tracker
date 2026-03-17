import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import connectDB from './config/db.js';
import authRoutes from './routes/userRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'
dotenv.config();
connectDB()
const app = express();
app.use(cors({
  origin:"smart-expense-tracker-mu-two.vercel.app",
  credentials:true
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use('/api/auth',authRoutes)
app.use("/api/transaction/dashboard", dashboardRoutes);
app.use("/api/transaction",transactionRoutes)
app.get('/', (req, res) => {
  res.send('Server running');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at port ${process.env.PORT}`);
});
