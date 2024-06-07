export type Message = MoveMessage;

export type MoveMessage = {
  id: "move";
  direction: "up" | "down";
};

export type Game = {
  roomId: string;
  state: PongGameState;
  players: {
    left: string;
    right: string | undefined;
  };
};

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
  speed: number;
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
