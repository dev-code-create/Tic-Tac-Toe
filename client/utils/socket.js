import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

let socket = null;

//Initialize Socket.io connection
