import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { initializeSocketManager } from "./SocketManager.js";
import connectDB from "./Database/db_connection.js";

dotenv.config();

const app = express();

const httpSever = createServer(app);

const io = new Server(httpSever, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

//Rest API ROUTES

//health checkup
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Tic-Tac-Toe server is running",
    timestamp: new Date().toISOString(),
  });
});

//Get recent matches
app.get("/api/matches/recent", async (req, res) => {
  try {
    const Match = mongoose.model("Match");
    const matches = await Match.find()
      .sort({ playedAt: -1 })
      .limit(20)
      .lean();
    res.json({ success: true, matches });
  } catch (error) {
    console.error("Error Fetching Matches", error);
    res.status(500).json({
      success: false,
      message: "Error Fetching Matches",
    });
  }
});

//Database Connection
connectDB();

//Initialize soceket.io
initializeSocketManager(io);

//Start Server
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  await connectDB();

  httpSever.listen(PORT, () => {
    console.log("");
    console.log("🚀 ========================================");
    console.log(`🎮 Tic-Tac-Toe Server is running!`);
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌐 Health: http://localhost:${PORT}/health`);
    console.log("🔌 Socket.io ready for connections");
    console.log("🚀 ========================================");
    console.log("");
  });
};

startServer();

//Graceful shutdown

process.on("SIGINT", async () => {
  console.log("\n shutting down server");

  await mongoose.connection.close();
  httpSever.close(() => {
    console.log("Shutting down the server");
    process.exit(0);
  });
});
