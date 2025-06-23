import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { protect } from './middlewares/protect';
import userRoutes from './routes/user.routes';
import authorRoutes from './routes/author.routes';
import bookRoutes from './routes/book.routes';
import eventRoutes from './routes/event.routes';
import reviewRoutes from './routes/review.routes';
import purchaseRoutes from './routes/purchase.routes';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ⚙️ Swagger UI (facultatif)
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'API eBook Store', version: '1.0.0' },
    servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 🔐 1) Protéger toutes les routes /api/* avec JWT
// 📦 2) Monter chaque router (chacun gère ses propres requireRole)
app.use('/api/users', userRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/purchases', purchaseRoutes);

export default app;
