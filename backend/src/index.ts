import { createApp } from "./app.js";
import { checkDatabaseConnection } from "./utils/db.js";
import { PORT } from "./utils/env.js";

const app = createApp();

checkDatabaseConnection();

if (!process.env.VERCEL) {
  app.listen(Number(PORT), () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
}

export default app;
