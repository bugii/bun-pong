import { createSignal, type Component } from "solid-js";

const App: Component = () => {
  console.log("running main compoment");

  const [roomId, setRoomId] = createSignal("");
  const [username, setUsername] = createSignal("");

  function join() {
    console.log("joining, ", roomId());
    const ws = new WebSocket(
      `ws:localhost:4444?username=${username()}&roomId=${roomId()}`,
    );

    ws.onmessage = (msg) => {
      console.log("received msg", msg.data);
    };
  }

  return (
    <div>
      <div class="flex gap-4">
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
    </div>
  );
};

export default App;
