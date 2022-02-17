import { Server, Socket } from "socket.io";
import { v4 as uuid } from "uuid";
import {
  CREATE,
  GAME_ID,
  JOIN_GAME,
  PLAYERS_DATA,
  START_GAME,
  STATUS,
} from "./lib/variables";

import { JoinData, Connections } from "./types/Game";

let gameSocket: Socket;
let io: Server;
const gameRooms: Connections = {}; // Keeps tracks of players in their respective game rooms
export default function GameConnection(socketIO: Server, socket: Socket) {
  gameSocket = socket;
  io = socketIO;
  console.log(`[${new Date().toISOString()}] connected!`);

  // Handle Events emitted by the client
  socket.on(CREATE, handleCreateRoom);
  socket.on(JOIN_GAME, handleJoin);
}

/**
 * Handles a socket creating a game room.
 * Flow 1
 * @param this
 * @param name
 */
function handleCreateRoom(this: Socket, name: string) {
  const id = this.id;
  const gameID = uuid();
  const player = { name, id };
  console.log(name, "will be added to the room");
  this.join(gameID);

  // Add the respective instance
  gameRooms[gameID] = { players: [player] };

  // Send the game ID to create the URL in the client
  io.sockets.in(gameID).emit(GAME_ID, gameID);
}

/**
 * Handles a socket trying to join a game room that might have already been created.
 * Flow 2
 * @param this
 * @param data
 */
function handleJoin(this: Socket, data: JoinData) {
  const { name, gameID } = data;
  const id = this.id;
  const player = { name, id };

  // Check if the game exists
  if (gameRooms[gameID] === undefined) {
    this.emit(STATUS, "Game room does not exist");
  } else if (gameRooms[gameID].players.length < 2) {
    // For now check that the game room has less than 2 players
    console.log(name, "will be added to the room");
    this.join(gameID);
    gameRooms[gameID].players.push(player);
    io.sockets.in(gameID).emit(PLAYERS_DATA, gameRooms[gameID]);
    io.sockets.in(gameID).emit(START_GAME);
  } else {
    // TODO: code the part where you allow spectators to join the chat and see the other players game
    this.emit(
      STATUS,
      "There are 2 players in this game. Spectator mode will be available in the next release."
    );
  }
}
