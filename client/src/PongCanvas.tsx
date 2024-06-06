import { onCleanup, onMount } from "solid-js";
import { startGame, tick, Ball, Paddle, Field } from "./pong";

export function Pong() {
  let canvas: HTMLCanvasElement | undefined;
  onMount(() => {
    const ctx = canvas?.getContext("2d");
    if (!ctx) {
      return;
    }
    const game = startGame();


    let frame = requestAnimationFrame(() => loop(ctx));

    function loop(ctx: CanvasRenderingContext2D) {
      tick(game);
      drawField(game.field, ctx);
      ctx.beginPath();
      ctx.moveTo(game.field.width / 2, 0);
      ctx.lineTo(game.field.width / 2, game.field.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, game.field.height / 2);
      ctx.lineTo(game.field.width, game.field.height / 2);
      ctx.stroke();
      drawBall(game.ball, ctx);
      drawPaddle(game.left, ctx);
      drawPaddle(game.right, ctx);

      frame = requestAnimationFrame(() => loop(ctx));
    }

    function drawField(field: Field, ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = "beige";
      ctx.fillRect(0, 0, game.field.width, game.field.height);
    }

    function drawBall(ball: Ball, ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.strokeStyle = "black";
      ctx.arc(ball.position.x + ball.radius, ball.position.y + ball.radius, ball.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }

    function drawPaddle(paddle: Paddle, ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = "orange";
      ctx.fillRect(paddle.position.x, paddle.position.y, paddle.width, paddle.height);
    }

    onCleanup(() => cancelAnimationFrame(frame));
  });

  return <canvas ref={canvas!} width="750" height="250"></canvas>;
}
