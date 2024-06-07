import { createSignal, type Component, Show } from "solid-js";
import { Pong } from "./PongCanvas";
import { Game, Message } from "../../shared/types";
import { MovementControls } from "./MovementControls";

const App: Component = () => {
  const [roomId, setRoomId] = createSignal("");
  const [username, setUsername] = createSignal("");

  const [game, setGame] = createSignal<undefined | Game>(undefined);
  const [ws, setWs] = createSignal<undefined | WebSocket>(undefined);
  const backendUrl = import.meta.env.PROD ? 'wss://bun-pong.onrender.com' : 'ws://localhost:4444';

  function join() {
    console.log("joining, ", roomId());
    const ws = new WebSocket(
      `${backendUrl}?username=${username()}&roomId=${roomId()}`,
    );

    ws.onmessage = (msg) => {
      const message: Message = JSON.parse(msg.data);
      switch (message.id) {
        case 'gameState':
          setGame(message.game);
          break;
        case 'gameEnd':
          ws.close();
          setRoomId('');
          setUsername('');
          setGame(undefined);
          break;
        default:
          console.log('Encountered unknown message id:', message);
      }

    };

    setWs(ws);
  }

  return (
    <>
      <div class="flex flex-col items-start">
        <Show
          fallback={
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
          }
          when={game() !== undefined}
        >
          <b>roomId: {roomId()}</b>
        </Show>
        <Show
          fallback={
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
          }
          when={game()}
        >
          <b>username: {username()}</b>
        </Show>

        <button onClick={join} class="disabled:text-gray-300">
          join now
        </button>
      </div>
      <Show
        when={game() !== undefined && ws() !== undefined}
        fallback={<p>Waiting for game to start ...</p>}
      >
        <Pong game={game()!} />
        <MovementControls webSocket={ws()!} />
      </Show>
    </>
  );
};

export default App;
