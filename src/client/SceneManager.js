class SceneManager {
    currentScene;
    scenes = {};

    addScene(name, scene) {
        this.scenes[name] = scene;
    }

    changeScene(name) {
        this.currentScene = this.scenes[name];
        this.currentScene.initialize();
    }
}

const sceneManager = new SceneManager();

export default sceneManager;