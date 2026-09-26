import mongoose from "mongoose";
import dns from "node:dns";

const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in the environment variables");
  }

  const dnsServer = process.env.MONGO_DNS_SERVER;

  if (dnsServer) {
    dns.setServers([dnsServer]);
  }

  try {
    await mongoose.connect(mongoUri);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed");

    if (error instanceof Error) {
      console.error(error.message);
    }

    throw error;
  }
};

export default connectDB;
