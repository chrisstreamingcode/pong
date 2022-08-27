import createStartScreen from './createStartScreen';
import sceneManager from "./SceneManager";
import createGame from "./createGame";
import createGameOver from "./createGameOver";
import { Scenes } from "./constants";

const canvas = document.querySelector('canvas');
const { width, height } = canvas;
const context = canvas.getContext('2d');

sceneManager.addScene(Scenes.START_SCREEN, createStartScreen(canvas, context));
sceneManager.addScene(Scenes.GAME, createGame(canvas, context));
sceneManager.addScene(Scenes.GAME_OVER, createGameOver(canvas, context));

let lastTime = Date.now();

function tick() {
    const now = Date.now();
    const delta = now - lastTime;
    lastTime = now;

    sceneManager.currentScene.tick && sceneManager.currentScene.tick(delta / 1000);

    draw();

    requestAnimationFrame(tick);
}

function draw() {
    context.clearRect(0, 0, width, height);

    context.save();
    sceneManager.currentScene.render && sceneManager.currentScene.render();
    context.restore();
}

sceneManager.changeScene(Scenes.START_SCREEN);
tick();