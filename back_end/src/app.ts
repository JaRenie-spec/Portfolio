// back/src/app.ts
import express from 'express';
import bookRoutes from './routes/book.routes';
import purchaseRoutes from './routes/purchase.routes';
// Importe d'autres routes au besoin

const app = express();

app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);
app.use('/purchases', purchaseRoutes);

export default app;
