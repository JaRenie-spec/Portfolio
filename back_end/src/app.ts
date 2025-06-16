// back/src/app.ts
import express from 'express';

import bookRoutes from './routes/book.routes';
import purchaseRoutes from './routes/purchase.routes';
// Importe d'autres routes au besoin
import userRoutes from './routes/user.routes';
import { userInfo } from 'os';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';

const app = express();

app.use(express.json());

// 🧩 Configuration Swagger
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Admin API',
      version: '1.0.0',
      description: 'Documentation Swagger de l’API Admin',
    },
    servers: [
      {
        url: 'http://localhost:3000', // adapte si ton port change
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // ajuste le chemin si tes routes sont ailleurs
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/users', userRoutes);
app.use('/api/books', bookRoutes);

app.use('/purchases', purchaseRoutes);
app.use('/events', eventRoutes); // ← AJOUTE CETTE LIGNE


export default app;
