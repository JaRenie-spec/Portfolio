// back/src/app.ts
import express from 'express';
import bookRoutes from './routes/book.routes';
import path from "path";
// Importe d'autres routes au besoin

const app = express();

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Routes
app.use('/api/books', bookRoutes);

export default app;
