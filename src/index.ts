import express from "express";
import socketIO from "socket.io";
import { createServer } from "http";
import GameConnection from "./GameConnection";

const app = express();
const server = createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 8080;
app.set("port", PORT);
io.origins("*:*");

io.on("connection", (socket) => {
  GameConnection(io, socket);
});

app.get("/", (req, res) => {
  res.send("hello");
});

server.listen(PORT, () => {
  console.log("Server listening on", PORT);
});
