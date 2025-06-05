// back/src/app.ts
import express from 'express';
import bookRoutes from './routes/book.routes';
import userRoutes from './routes/user.routes';
import { userInfo } from 'os';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
// Importe d'autres routes au besoin

const app = express();

app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/api/books', bookRoutes);

export default app;
