export function getInitialGameState(): PongGameState {
  const paddleWidth = 10;
  const paddleHeight = 50;
  const paddleAnchor = { x: 0, y: 0 };
  const ballRadius = 10;
  const fieldWidth = 750;
  const fieldHeight = 250;
  const initialPaddleYPosition = fieldHeight / 2 - paddleHeight / 2;
  const paddleOffset = 10;
  return {
    left: {
      width: paddleWidth,
      height: paddleHeight,
      anchor: paddleAnchor,
      position: {
        x: paddleOffset,
        y: initialPaddleYPosition,
      },
      speed: 8,
    },
    right: {
      width: paddleWidth,
      height: paddleHeight,
      anchor: paddleAnchor,
      position: {
        x: fieldWidth - paddleOffset - paddleWidth,
        y: initialPaddleYPosition,
      },
      speed: 8,
    },
    ball: {
      radius: ballRadius,
      anchor: {
        x: 0,
        y: 0,
      },
      position: {
        x: fieldWidth / 2 - ballRadius,
        y: fieldHeight / 2 - ballRadius,
      },
      speedX: 4,
      speedY: 4,
    },
    field: {
      width: fieldWidth,
      height: fieldHeight,
    },
    score: {
      left: 0,
      right: 0,
    },
  };
}

function playerScored(state: PongGameState, side: "left" | "right"): void {
  const newGame = getInitialGameState();
  const test = {
    ...newGame,
    score: {
      left: side === "left" ? state.score.left + 1 : state.score.left,
      right: side === "right" ? state.score.right + 1 : state.score.right,
    },
  };
  Object.assign(state, test);
}

export function tick(state: PongGameState): void {
  moveBall(state.ball);
  ballBounce(state);
}

function moveBall(ball: Ball): void {
  ball.position.x += ball.speedX;
  ball.position.y += ball.speedY;
}

function ballBounce(state: PongGameState): void {
  const { ball } = state;
  const { left, right } = state;
  const { position, radius } = ball;
  const { field } = state;
  let ballBouncedOffPaddle = false;
  if (position.y + 2 * radius >= field.height || position.y <= 0) {
    ball.speedY *= -1;
  }

  // hit detection left paddle
  if (
    position.x <= left.position.x + left.width &&
    position.y >= left.position.y &&
    position.y <= left.position.y + left.height
  ) {
    ball.speedX *= -1;
    ballBouncedOffPaddle = true;
  }

  // hit detection right paddle
  if (
    position.x + 2 * radius >= right.position.x &&
    position.y >= right.position.y &&
    position.y + 2 * radius <= right.position.y + right.height
  ) {
    ball.speedX *= -1;
    ballBouncedOffPaddle = true;
  }

  if (!ballBouncedOffPaddle) {
    checkBallOutOfBounds(state);
  }
}

function checkBallOutOfBounds(state: PongGameState): void {
  const { ball } = state;
  const { position, radius } = ball;
  const { field } = state;

  if (position.x - 2 * radius <= 0) {
    playerScored(state, "right");
  }

  if (position.x + 2 * radius >= field.width) {
    playerScored(state, "left");
  }
}

export function move(
  state: PongGameState,
  paddle: "left" | "right",
  direction: "up" | "down",
): PongGameState {
  const yDelta = direction === "up" ? -1 : 1;
  state[paddle].position.y += yDelta * state[paddle].speed;
  // todo check if paddle out of bounds
  return state;
}
