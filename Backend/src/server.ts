import "dotenv/config";

import app from "./app.js";
import connectDB from "./Config/db.js";

const PORT = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`VOXA API server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start VOXA API server");

    if (error instanceof Error) {
      console.error(error.message);
    }

    process.exit(1);
  }
};

void startServer();