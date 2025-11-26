import { PORT } from './config';
import { createApp } from './app';

(async () => {
  try {
    const app = createApp(true); // Initialize DB immediately for traditional server
    console.log(`Routes Mounted`);

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
