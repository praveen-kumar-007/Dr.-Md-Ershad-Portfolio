import dotenv from "dotenv";
import app from "./app.js";
import connectDatabase from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

async function startServer() {
  try {
    await connectDatabase(MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();
