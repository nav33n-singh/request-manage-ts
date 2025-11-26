import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import { Database } from './databases';
import { auth } from './middlewares/auth';
import { errorHandler } from './middlewares/error-handler';
import { requestContext } from './middlewares/request-context';
import rootRouter from './routes';

const databases = Database.getInstance();

// Initialize database connection
let dbInitialized = false;

const initDatabase = async () => {
  if (!dbInitialized) {
    try {
      await databases.initPostgres();
      console.log('Postgres connection is established');
      dbInitialized = true;
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }
};

export const createApp = (initializeDbImmediately = false) => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(json());

  // Initialize database before handling requests (lazy initialization for serverless)
  app.use(async (req, res, next) => {
    try {
      await initDatabase();
      next();
    } catch (error) {
      next(error);
    }
  });

  // Pre-middlewares
  app.use(requestContext);
  app.use(auth);

  // Routes
  app.use("/api/v1", rootRouter);

  // Post-middlewares
  app.use(errorHandler);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Initialize database immediately if requested (for traditional server)
  if (initializeDbImmediately) {
    initDatabase().catch((error) => {
      console.error('Failed to initialize database:', error);
    });
  }

  return app;
};

