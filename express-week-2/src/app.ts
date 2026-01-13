import express, { Application } from "express";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import AppDataSource from "./config/database";

const app: Application= express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
AppDataSource.initialize()
  .then(() => {console.log('Data source has been initialized')})
  .catch((err) => {console.log('Error during initialization', err)});

export default app;

