// back/src/app.ts
import express from 'express';
import bookRoutes from './routes/book.routes';
import authorRoutes from "./routes/author.routes";
//import authRoutes from "./routes/auth.routes";

// Importe d'autres routes au besoin

const app = express();

app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);
app.use("/api", authorRoutes);
//app.use("/api/auth", authRoutes);



export default app;
