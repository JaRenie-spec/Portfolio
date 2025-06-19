// src/app.ts

import express, { Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import bookRoutes from './routes/book.routes';
import purchaseRoutes from './routes/purchase.routes';
import userRoutes from './routes/user.routes';
import reviewRoutes from './routes/review.routes';
import eventRoutes from './routes/event.routes';
import authorRoutes from './routes/author.routes';
import adminRoutes from './routes/admin.routes';

const app = express();
app.use(express.json());

// 1) Accueil redirige vers Swagger UI

app.get('/', (_req: Request, res: Response) => {
  return res.redirect('/api-docs');
});

// 2) Configuration Swagger
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Admin API',
      version: '1.0.0',
      description: 'Documentation Swagger de l’API Admin'
    },
    servers: [
      { url: 'http://localhost:3000' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.ts']
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 3) Montage des routes
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/admins', adminRoutes);

export default app;
