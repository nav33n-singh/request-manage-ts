import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import { Database } from './databases'
import { PORT } from './config'
import { auth } from './middlewares/auth';
import { errorHandler } from './middlewares/error-handler';
import { requestContext } from './middlewares/request-context';
import rootRouter from './routes';

const databases = Database.getInstance();

(async () => {
  try {
    const app = express();
    app.use(cors());
    app.use(json());

    // establish db connection
    await databases.initPostgres();
    console.log(`Postgres connection is established`);

    // pre-middlewares
    app.use(requestContext);
    app.use(auth);

    // routes
    app.use("/api/v1", rootRouter);
    console.log(`Routes Mounted`);

    // post-middlewares
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server is listening on http://localhost:${PORT}`);
    });

    process.on("uncaughtException", (err) => {
      console.error('uncaughtException', err.message);
      process.exit(1);
    });

    process.on("unhandledRejection", (reason: any) => {
      console.error('unhandledRejection', reason);
      process.exit(1);
    });
  } catch (error) {
    console.error('error starting server', error);
    process.exit(1);
  }
})()
