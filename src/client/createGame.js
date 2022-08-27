import sceneManager from "./SceneManager";
import clamp from "./clamp";
import rectCollision from "./rectCollision";
import scaleValue from "./scaleValue";
import dataManager from "./DataManager";
import { DataKeys, Scenes } from "./constants";

const PADDLE_HEIGHT = 80; // px
const PADDLE_WIDTH = 10; // px
const PADDING_X = 20; // px
const BALL_DIAMETER = 20; // px

const PADDLE_MAX_VELOCITY = 200; // px / s
const PADDLE_ACCELERATION = 400; // px / s / s
const PADDLE_DECELERATION = 600; // px / s / s

const BALL_MAX_VELOCITY = 400; // px / s
const BALL_ACCELERATION = 20; // per paddle hit

const MAX_SCORE = 10;

const Keys = {
  PLAYER1_UP: 'KeyW',
  PLAYER1_DOWN: 'KeyS',
  PLAYER2_UP: 'ArrowUp',
  PLAYER2_DOWN: 'ArrowDown'
};

const createGame = (canvas, context) => {
  const keysDown = [];
  const { width, height } = canvas;

  let player1;
  let player2;
  let ball;

  const initialize = () => {
    player1 = {
      x: PADDING_X,
      y: height / 2 - PADDLE_HEIGHT / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      velocity: 0,
      keyUp: Keys.PLAYER1_UP,
      keyDown: Keys.PLAYER1_DOWN,
      score: 0
    };

    player2 = {
      x: width - PADDING_X - PADDLE_WIDTH,
      y: height / 2 - PADDLE_HEIGHT / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      velocity: 0,
      keyUp: Keys.PLAYER2_UP,
      keyDown: Keys.PLAYER2_DOWN,
      score: 0
    };

    resetBall();

    document.addEventListener('keydown', (event) => {
      if (!keysDown.includes(event.code)) {
        keysDown.push(event.code);
      }
    });

    document.addEventListener('keyup', (event) => {
      const index = keysDown.indexOf(event.code);

      if (index === -1) return;

      keysDown.splice(index, 1);
    });
  };

  const tick = (delta) => {
    moveBall(delta);
    movePlayer(delta, player1);
    movePlayer(delta, player2);

    if (player1.score >= MAX_SCORE || player2.score >= MAX_SCORE) {
      dataManager.set(DataKeys.WINNER, player1.score >= MAX_SCORE ? 'Player 1' : 'Player 2');
      sceneManager.changeScene(Scenes.GAME_OVER);
    }
  }

  const moveBall = (delta) => {
    ball.x += ball.velocity * Math.cos(ball.angle) * delta;
    ball.y += ball.velocity * Math.sin(ball.angle) * delta;

    if (ball.y <= 0 || ball.y + ball.height >= height) {
      ball.angle = -ball.angle;
      ball.velocity += BALL_ACCELERATION;

      if (ball.y <= 0) {
        ball.y = 0.1;
      } else {
        ball.y = height - ball.height - 0.1;
      }
    } else if (ball.x <= 0) {
      player2.score++;
      resetBall();
    } else if (ball.x + ball.width >= width) {
      player1.score++;
      resetBall();
    } else {
      const player1Collision = rectCollision(player1, ball);
      const player2Collision = rectCollision(player2, ball);

      if (player1Collision || player2Collision) {
        let paddleOffset;

        if (player1Collision) {
          ball.x = player1.x + player1.width + 0.1;
          paddleOffset = scaleValue(((ball.y + ball.height / 2) - player1.y) / player1.height, -1, 1);
        } else {
          ball.x = player2.x - ball.width - 0.1;
          paddleOffset = scaleValue(((ball.y + ball.height / 2) - player2.y) / player2.height, -1, 1);
        }

        ball.angle = -(ball.angle + (paddleOffset * Math.PI / 6)) - Math.PI;
        ball.velocity += BALL_ACCELERATION;
      }
    }
  };

  const movePlayer = (delta, player) => {
    const direction = keysDown.includes(player.keyUp)
        ? -1
        : keysDown.includes(player.keyDown)
            ? 1
            : 0;

    updatePaddle(delta, player, direction);
  }

  const updatePaddle = (delta, paddle, direction) => {
    let { velocity, y, height: paddleHeight } = paddle;

    if (direction === 0) {
      velocity += (velocity < 0 ? 1 : -1) * PADDLE_DECELERATION * delta;
    } else {
      velocity += direction * PADDLE_ACCELERATION * delta;
    }

    velocity = clamp(velocity, -PADDLE_MAX_VELOCITY, PADDLE_MAX_VELOCITY);
    y = clamp(y + (velocity * delta), 0, height - paddleHeight);

    Object.assign(paddle, { velocity, y });
  }

  const resetBall = () => {
    ball = {
      x: width / 2 - BALL_DIAMETER / 2,
      y: height / 2 - BALL_DIAMETER / 2,
      width: BALL_DIAMETER,
      height: BALL_DIAMETER,
      velocity: BALL_MAX_VELOCITY / 2,
      angle: (Math.floor(Math.random() * 4) * 2 + 1) * Math.PI / 4 // radians
    };
  }

  const render = () => {
    drawBackground();
    drawScore();
    drawPaddle(player1);
    drawPaddle(player2);
    drawBall();
  };

  const drawBackground = () => {
    context.fillStyle = '#333';
    context.fillRect(0, 0, width, height);
  }

  const drawScore = () => {
    context.font = '24px Arial, Helvetica, sans-serif';
    context.fillStyle = '#F0F0F0';
    context.textBaseline = 'top';

    context.textAlign = 'right';
    context.fillText(player1.score, width / 2 - 50, 4);

    context.textAlign = 'left';
    context.fillText(player2.score, width / 2 + 50, 4);
  };

  const drawPaddle = (paddle) => {
    context.fillStyle = '#0080FF';
    context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  };

  const drawBall = () => {
    context.fillStyle = '#CCC';

    context.beginPath();
    context.arc(
        ball.x + ball.width / 2,
        ball.y + ball.height / 2,
        BALL_DIAMETER / 2,
        0,
        Math.PI * 2,
        false
    );
    context.closePath();
    context.fill();
  };

  return { initialize, tick, render };
};

export default createGame;