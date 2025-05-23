// src/socket.js
import {io} from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

export default socket;
