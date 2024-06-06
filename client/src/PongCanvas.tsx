import { onCleanup, onMount } from "solid-js";
import { startGame } from "./pong";

export function Pong() {
  let canvas: HTMLCanvasElement | undefined;
  onMount(() => {
    const ctx = canvas?.getContext("2d");
    if (!ctx) {
      return;
    }
    const game = startGame();

    ctx.fillStyle = "beige";
    ctx.fillRect(0, 0, game.field.width, game.field.height);

    let frame = requestAnimationFrame(loop);

    function loop() {
      frame = requestAnimationFrame(loop);
    }

    onCleanup(() => cancelAnimationFrame(frame));
  });

  return <canvas ref={canvas!} width="750" height="250"></canvas>;
}
