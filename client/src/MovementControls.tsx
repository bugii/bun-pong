import { onCleanup, onMount } from "solid-js";
import { Game, MoveMessage } from "../../shared/types";

type MovementControlsProps = {
  webSocket: WebSocket;
}

export function MovementControls(props: MovementControlsProps) {
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
    const { webSocket } = props;
    const moveMessage: MoveMessage = {
      direction,
      id: 'move'
    }
    webSocket.send(JSON.stringify(moveMessage));
  }

  document.addEventListener("keydown", handleKeyDown);
  onCleanup(() => document.removeEventListener('keydown', handleKeyDown));

  return <></>
}
