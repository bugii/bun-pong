import { onCleanup, onMount } from "solid-js";
import { Field, Ball, Paddle, Game } from "../../shared/types";

type PongProps = {
  game: Game;
};
export function Pong({ game }: PongProps) {
  let canvas: HTMLCanvasElement | undefined;

  onMount(() => {
    const ctx = canvas?.getContext("2d");
    if (!ctx) {
      return;
    }
    // const game = startGame();

    let frame = requestAnimationFrame(() => loop(ctx));

    function loop(ctx: CanvasRenderingContext2D) {
      // tick(game);
      drawField(game.field, ctx);
      drawMidlines(game.field, ctx);
      drawBall(game.ball, ctx);
      drawPaddle(game.left, ctx);
      drawPaddle(game.right, ctx);

      frame = requestAnimationFrame(() => loop(ctx));
    }

    function drawMidlines(field: Field, ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.moveTo(field.width / 2, 0);
      ctx.lineTo(field.width / 2, field.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, field.height / 2);
      ctx.lineTo(field.width, field.height / 2);
      ctx.stroke();
    }

    function drawField(field: Field, ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = "beige";
      ctx.fillRect(0, 0, field.width, field.height);
    }

    function drawBall(ball: Ball, ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.strokeStyle = "black";
      ctx.arc(
        ball.position.x + ball.radius,
        ball.position.y + ball.radius,
        ball.radius,
        0,
        2 * Math.PI,
      );
      ctx.fill();
      ctx.stroke();
    }

    function drawPaddle(paddle: Paddle, ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = "orange";
      ctx.fillRect(
        paddle.position.x,
        paddle.position.y,
        paddle.width,
        paddle.height,
      );
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          move(game, "right", "up");
          break;
        case "ArrowDown":
          move(game, "right", "down");
          break;
        case "w":
          move(game, "left", "up");
          break;
        case "s":
          move(game, "left", "down");
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    onCleanup(() => cancelAnimationFrame(frame));
  });

  return <canvas ref={canvas!} width="750" height="250"></canvas>;
}
