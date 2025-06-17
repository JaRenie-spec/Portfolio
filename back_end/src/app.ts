import express from 'express';
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

// Swagger
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Admin API',
      version: '1.0.0',
      description: 'Documentation Swagger de l’API Admin',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./src/routes/*.ts'],
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/purchases', purchaseRoutes);
app.use('/events', eventRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/authors', authorRoutes);
app.use('/admins', adminRoutes);

export default app;
