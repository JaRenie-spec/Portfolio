// back/src/app.ts
import express from 'express';
import bookRoutes from './routes/book.routes';
import eventRoutes from './routes/event.routes'; // ← AJOUTE CETTE LIGNE
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

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
app.use('/api/books', bookRoutes);
app.use('/events', eventRoutes); // ← AJOUTE CETTE LIGNE

export default app;
