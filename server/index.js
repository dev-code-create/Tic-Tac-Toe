import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { initializeSocketManager } from "./SocketManager";

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
