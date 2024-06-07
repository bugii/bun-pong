import { onCleanup, onMount } from "solid-js";
import { Field, Ball, Paddle, Game } from "../../shared/types";

type PongProps = {
  game: Game;
};
export function Pong(props: PongProps) {
  let canvas: HTMLCanvasElement | undefined;

  onMount(() => {
    const ctx = canvas?.getContext("2d");
    if (!ctx) {
      return;
    }
    let frame = requestAnimationFrame(() => loop(ctx));

    function loop(ctx: CanvasRenderingContext2D) {
      const { field, ball, left, right } = props.game.state;
      drawField(field, ctx);
      drawMidlines(field, ctx);
      drawBall(ball, ctx);
      drawPaddle(left, ctx);
      drawPaddle(right, ctx);

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

    onCleanup(() => cancelAnimationFrame(frame));
  });

  return <canvas ref={canvas!} width="750" height="250"></canvas>;
}
