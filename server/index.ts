import { getInitialGameState, move, tick } from "./pong";
import {
  type Game,
  type GameEndedMessage,
  type GameStateMessage,
  type Message,
} from "../shared/types";

const games: Map<string, Game> = new Map();

const server = Bun.serve<{ username: string; roomId: string }>({
  port: 4444,
  fetch(req, server) {
    const url = new URL(req.url);

    const success = server.upgrade(req, {
      data: {
        username: url.searchParams.get("username"),
        roomId: url.searchParams.get("roomId"),
      },
    });
    if (success) {
      // Bun automatically returns a 101 Switching Protocols
      // if the upgrade succeeds
      return undefined;
    }

    // handle HTTP request normally
    return new Response("Hello world!");
  },
  websocket: {
    open(ws) {
      const { roomId, username } = ws.data;
      ws.subscribe(ws.data.roomId);
      const gameForRoom = games.get(roomId);
      if (!gameForRoom) {
        games.set(roomId, {
          roomId,
          players: { left: username, right: undefined },
          state: getInitialGameState(),
        });
      } else {
        gameForRoom.players.right = username;
      }
    },
    // this is called when a message is received
    async message(ws, message) {
      console.log(`Received ${message}`);
      const parsedMessage: Message = JSON.parse(message.toString());
      const game = games.get(ws.data.roomId);
      if (!game || !game.players.right) {
        return;
      }

      switch (parsedMessage.id) {
        case "move":
          const position =
            game.players.left === ws.data.username ? "left" : "right";
          move(game.state, position, parsedMessage.direction);
          break;

        default:
          break;
      }
    },
    close(ws) {
      games.delete(ws.data.roomId);
      const message: GameEndedMessage = { id: "gameEnd" };
      ws.publish(ws.data.roomId, JSON.stringify(message));
    },
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);

setInterval(() => {
  for (const [roomId, game] of games.entries()) {
    if (game.players.right !== undefined) tick(game.state);
    const message: GameStateMessage = {
      id: "gameState",
      game,
    };
    server.publish(roomId, JSON.stringify(message));
  }

  games.entries();
}, 1000 / 60);
