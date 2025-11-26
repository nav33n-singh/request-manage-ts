import dotenv from 'dotenv';
dotenv.config();

import { createApp } from '../src/app';

// Create app with lazy DB initialization (for serverless cold starts)
// Database will be initialized on first request via middleware
const app = createApp(false);

// Export as serverless function
export default app;

