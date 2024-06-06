export function startGame(): PongGameState {
  const paddleWidth = 10;
  const paddleHeight = 50;
  const paddleAnchor = { x: 0, y: 0 };
  const ballRadius = 30;
  const fieldWidth = 750;
  const fieldHeight = 250;
  const initialPaddleYPosition = fieldHeight / 2 - paddleHeight / 2;

  return {
    left: {
      width: paddleWidth,
      height: paddleHeight,
      anchor: paddleAnchor,
      position: {
        x: 10,
        y: initialPaddleYPosition,
      },
    },
    right: {
      width: paddleWidth,
      height: paddleHeight,
      anchor: paddleAnchor,
      position: {
        x: fieldWidth - 10,
        y: initialPaddleYPosition,
      },
    },
    ball: {
      radius: ballRadius,
      anchor: {
        x: ballRadius / 2,
        y: ballRadius / 2,
      },
      position: {
        x: fieldWidth / 2,
        y: fieldHeight / 2,
      },
      speedX: 0,
      speedY: 0,
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

function playerScored(
  state: PongGameState,
  side: "left" | "right",
): PongGameState {
  const newGame = startGame();
  return {
    ...newGame,
    score: {
      left: side === "left" ? state.score.left + 1 : state.score.left,
      right: side === "right" ? state.score.right + 1 : state.score.right,
    },
  };
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

  if (position.y + radius >= field.height || position.y - radius <= 0) {
    ball.speedY *= -1;
  }

  if (
    position.x - radius <= left.position.x + left.width &&
    position.y >= left.position.y &&
    position.y + radius <= left.position.y + left.height
  ) {
    ball.speedX *= -1;
    ballBouncedOffPaddle = true;
  }

  if (
    position.x + radius >= right.position.x &&
    position.y >= right.position.y &&
    position.y + radius <= right.position.y + right.height
  ) {
    ball.speedX *= -1;
    ballBouncedOffPaddle = true;
  }

  if (ballBouncedOffPaddle) {
    checkBallOutOfBounds(state);
  }
}

function checkBallOutOfBounds(state: PongGameState): void {
  const { ball } = state;
  const { position, radius } = ball;
  const { field } = state;

  if (position.x - radius <= 0) {
    playerScored(state, "right");
  }

  if (position.x + radius >= field.width) {
    playerScored(state, "left");
  }
}

export function move(
  state: PongGameState,
  paddle: "left" | "right",
  direction: "up" | "down",
): PongGameState {
  const yDelta = direction === "up" ? -1 : 1;
  state[paddle].position.y += yDelta;
  // todo check if paddle out of bounds
  return state;
}

export type PongGameState = {
  left: Paddle;
  right: Paddle;
  ball: Ball;
  field: Field;
  score: Score;
};

export type Paddle = {
  width: number;
  height: number;
  position: Position;
  anchor: Anchor;
};

export type Ball = {
  position: Position;
  anchor: Anchor;
  radius: number;
  speedY: number;
  speedX: number;
};

export type Field = {
  width: number;
  height: number;
};

export type Score = {
  left: number;
  right: number;
};

export type Anchor = {
  x: number;
  y: number;
};

export type Position = {
  x: number;
  y: number;
};
