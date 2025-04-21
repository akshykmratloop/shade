// socket.js
import {io} from "socket.io-client";

const SOCKET_URL = "http://localhost:3000/"; // Replace with your backend URL

export const socket = io(SOCKET_URL, {
  autoConnect: false, // so we can connect when needed
  withCredentials: true, // optional if using cookies
});
