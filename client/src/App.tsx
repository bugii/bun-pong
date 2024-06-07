import { createSignal, type Component, Show } from "solid-js";
import { Pong } from "./PongCanvas";
import { Game, MoveMessage } from "../../shared/types";

const App: Component = () => {
  console.log("running main compoment");

  const [roomId, setRoomId] = createSignal("");
  const [username, setUsername] = createSignal("");

  const [game, setGame] = createSignal<undefined | Game>(undefined);
  const [ws, setWs] = createSignal<undefined | WebSocket>(undefined);

  function join() {
    console.log("joining, ", roomId());
    const ws = new WebSocket(
      `ws:localhost:4444?username=${username()}&roomId=${roomId()}`,
    );

    ws.onmessage = (msg) => {
      const parsedGame: Game = JSON.parse(msg.data);
      setGame(parsedGame);
    };

    setWs(ws);
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowUp":
      case "w":
        sendMoveMessage("up");
        break;
      case "ArrowDown":
      case "s":
        sendMoveMessage("down");
        break;
    }
  };

  function sendMoveMessage(direction: 'up' | 'down') {
    const webSocket = ws();
    if (!game() || !webSocket) {
      return;
    }

    const moveMessage: MoveMessage = {
      direction,
      id: 'move'
    }
    webSocket.send(JSON.stringify(moveMessage));
  }

  document.addEventListener("keydown", handleKeyDown);
  return (
    <div>
      <div>
        <span>enter your room id</span>
        <input
          onChange={(e) => {
            setRoomId(e.target.value);
          }}
          class="border"
          type="text"
        />
      </div>

      <div class="flex gap-4">
        <span>enter username</span>
        <input
          type="text"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          class="border"
        />
      </div>

      <button onClick={join} class="disabled:text-gray-300">
        join now
      </button>

      <Show
        when={game() !== undefined}
        fallback={<p>Waiting for game to start ...</p>}
      >
        <Pong game={game()!} />
      </Show>
    </div>
  );
};

export default App;
