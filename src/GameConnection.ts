import { Socket } from "socket.io";

export default function GameConnection(socket: Socket) {
  console.log(`[${new Date().toISOString()}] connected!`);
}
