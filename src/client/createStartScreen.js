import sceneManager from "./SceneManager";
import {Scenes} from "./constants";

const TITLE = 'PONG';
const BUTTON_TEXT = 'START';

const createStartScreen = (canvas, context) => {
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

export default createStartScreen;
