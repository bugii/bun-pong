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
    <div class="p-4">
      <h1 class="text-xl mb-6">Bun Pong</h1>
      <div class="inline-grid grid-cols-[auto,auto] gap-2">
        <Show
          fallback={
            <>
              <span>enter your room id</span>
              <input
                onChange={(e) => {
                  setRoomId(e.target.value);
                }}
                class="border"
                type="text"
              />
            </>
          }
          when={game() !== undefined}
        >
          <span>roomId:</span>
          <span>{roomId()}</span>
        </Show>

        <Show
          fallback={
            <>
              <span>enter username</span>
              <input
                type="text"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                class="border"
              />

              <button
                onClick={join}
                class="px-4 py-2 justify-self-start bg-blue-600 hover:bg-blue-500 disabled:bg-gray-300 rounded text-white"
              >
                join now
              </button>
            </>
          }
          when={game()}
        >
          <span>username:</span>
          <span>{username()}</span>

          <span>Score</span>
          <div class="flex gap-2">
            <b>{game()?.state.score.left}</b>-<b>{game()?.state.score.right}</b>
          </div>
        </Show>
      </div>

      <div class="mt-6">
        <Show
          when={game() !== undefined && ws() !== undefined}
          fallback={<p>Waiting for game to start ...</p>}
        >
          <Pong game={game()!} />
          <MovementControls webSocket={ws()!} />
        </Show>
      </div>
    </div>
  );
};

export default App;
