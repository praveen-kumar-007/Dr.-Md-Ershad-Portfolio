import mongoose from "mongoose";

async function connectDatabase(uri) {
  if (!uri) {
    throw new Error("MONGODB_URI or DATABASE_URL is required in backend/.env");
  }

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  };

  try {
    await mongoose.connect(uri, options);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error.message);
    console.error("Possible causes:");
    console.error("  - Atlas IP whitelist is missing your current public IP");
    console.error("  - Atlas credentials or database name are incorrect");
    console.error(
      "  - Local TLS / proxy interception is blocking MongoDB TLS traffic",
    );
    console.error(
      "  - Your network may be preventing direct Atlas TLS on port 27017",
    );
    throw error;
  }
}

export default connectDatabase;
