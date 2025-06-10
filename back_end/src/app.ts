// back/src/app.ts
import express from 'express';
import authorRoutes from "./routes/author.routes";
//import authRoutes from "./routes/auth.routes";

// Importe d'autres routes au besoin

const app = express();

app.use(express.json());

// Routes
app.use("/api/authors", authorRoutes);
//app.use("/api/auth", authRoutes);



export default app;
