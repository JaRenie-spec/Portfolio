// back/src/app.ts
import express from 'express';
import bookRoutes from './routes/book.routes';
import adminRoutes from "./routes/admin.routes";
import adminResourcesRoutes from "./routes/adminResources.routes";

// Importe d'autres routes au besoin

const app = express();

app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/admins", adminResourcesRoutes);


export default app;
