import {Application, Assets, Sprite, Texture} from 'pixi.js';

export async function createStartButton(app: Application) {
    // Load texture
    await Assets.load("assets/start-button.png");

    // Create button texture
    const textureButton = Texture.from('assets/start-button.png');

    // Create button sprite
    const startButton = new Sprite(textureButton);

    // Calculer le scale pour obtenir une width de 400
    const desiredWidth = 400;
    const scale = desiredWidth / startButton.width;
    startButton.scale.set(scale);

    // Center the button
    startButton.anchor.set(0.5);
    startButton.x = app.screen.width / 2;
    startButton.y = app.screen.height / 2;

    // Make the button interactive
    startButton.eventMode = 'static';
    startButton.cursor = 'pointer';

    // Add button to stage
    app.stage.addChild(startButton);

    return startButton;
}

export async function createResetButton(app: Application) {
    // Load texture
    await Assets.load("assets/reset-button.png");

    // Create button texture
    const textureButton = Texture.from('assets/reset-button.png');

    // Create button sprite
    const resetButton = new Sprite(textureButton);

    // Calculer le scale pour obtenir une width de 400
    const desiredWidth = 400;
    const scale = desiredWidth / resetButton.width;
    resetButton.scale.set(scale);

    // Center the button
    resetButton.anchor.set(0.5);
    resetButton.x = app.screen.width / 2;
    resetButton.y = app.screen.height / 2;

    // Make the button interactive
    resetButton.eventMode = 'static';
    resetButton.cursor = 'pointer';

    return resetButton;
}