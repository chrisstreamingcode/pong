import sceneManager from "./SceneManager";
import {DataKeys, Scenes} from "./constants";
import dataManager from "./DataManager";

const TITLE = 'GAME OVER';
const BUTTON_TEXT = 'PLAY AGAIN';

const createGameOver = (canvas, context) => {
  const { width, height } = canvas;

  let buttonRect;

  const initialize = () => {
    context.save();

    styleButton();

    const metrics = context.measureText(BUTTON_TEXT);

    context.restore();

    buttonRect = {
      x: width / 2 - metrics.width / 2 - 20,
      y: 380,
      width: metrics.width + 40,
      height: 92
    };

    canvas.addEventListener('click', (event) => {
      const { offsetX, offsetY } = event;
      const { x, y, width, height } = buttonRect;

      if (offsetX >= x
          && offsetX <= x + width
          && offsetY >= y
          && offsetY <= y + height
      ) {
        sceneManager.changeScene(Scenes.GAME);
      }
    });
  }

  const render = () => {
    drawBackground();
    drawGameOver();
    drawWinner();
    drawStartButton();
  };

  const drawBackground = () => {
    context.fillStyle = '#333';
    context.fillRect(0, 0, width, height);
  }

  const drawGameOver = () => {
    context.fillStyle = '#0080FF';
    context.strokeStyle = '#F0F0F0';
    context.lineWidth = 5;
    context.font = 'bold 120px Arial, Helvetica, sans-serif';
    context.textBaseline = 'top';
    context.textAlign = 'center';

    context.fillText(TITLE, width / 2, 150);
    context.strokeText(TITLE, width / 2, 150);
  };

  const drawWinner = () => {
    context.fillStyle = '#F0F0F0';
    context.lineWidth = 5;
    context.font = 'bold 80px Arial, Helvetica, sans-serif';
    context.textBaseline = 'top';
    context.textAlign = 'center';

    context.fillText(`${dataManager.get(DataKeys.WINNER)} Wins!`, width / 2, 280);
  };

  const drawStartButton = () => {
    styleButton();

    context.fillStyle = '#0080FF';
    context.fillRect(buttonRect.x, buttonRect.y, buttonRect.width, buttonRect.height);

    context.fillStyle = '#FFF';
    context.fillText(BUTTON_TEXT, width / 2, buttonRect.y + 20);
  };

  const styleButton = () => {
    context.font = '60px Arial, Helvetica, sans-serif';
    context.textBaseline = 'top';
    context.textAlign = 'center';
  };

  return { initialize, render };
};

export default createGameOver;