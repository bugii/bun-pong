import { createSignal, type Component, Show } from "solid-js";
import { Pong } from "./PongCanvas";
import { Game } from "../../shared/types";

const App: Component = () => {
  console.log("running main compoment");

  const [roomId, setRoomId] = createSignal("");
  const [username, setUsername] = createSignal("");

  const [game, setGame] = createSignal<undefined | Game>(undefined);

  function join() {
    console.log("joining, ", roomId());
    const ws = new WebSocket(
      `ws:localhost:4444?username=${username()}&roomId=${roomId()}`,
    );

    ws.onmessage = (msg) => {
      console.log("received msg", msg.data);
      const parsedGame: Game = JSON.parse(msg.data);
      setGame(parsedGame);
    };
  }

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
