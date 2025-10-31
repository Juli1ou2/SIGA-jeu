import {Application, Sprite, Container} from "pixi.js";
import {createStartButton, createResetButton} from "./buttons.ts";
// @ts-ignore
import { startGame } from "../main.ts";

export async function launchMenu(app: Application) {
    const STATE_MENU = {
        "pause": false,
        "play": false,
        "gameOver": false,
    };

    // Activer le tri par zIndex sur le stage
    app.stage.sortableChildren = true;

    // Créer un container pour l'UI qui sera toujours au-dessus
    const uiContainer = new Container();
    uiContainer.sortableChildren = true;
    uiContainer.zIndex = 10000;
    app.stage.addChild(uiContainer);

    // Création du menu
    const startButton = createStartButton(app);
    uiContainer.addChild(startButton);

    const pauseIcon = Sprite.from("pause-button");
    pauseIcon.anchor.set(0.5);

    // Redimensionner à 200px de hauteur en gardant les proportions
    const desiredHeight = 300;
    const scaleRatio = desiredHeight / pauseIcon.height;
    pauseIcon.scale.set(scaleRatio);

    pauseIcon.x = app.screen.width / 2;
    pauseIcon.y = app.screen.height / 2 - 200;
    pauseIcon.visible = false;
    pauseIcon.zIndex = 1000;
    uiContainer.addChild(pauseIcon);

    // Créer le bouton reset
    const resetButton = createResetButton(app);
    resetButton.y = app.screen.height / 2 + 100;
    resetButton.visible = false;
    resetButton.zIndex = 1000;
    uiContainer.addChild(resetButton);

    // Fonction pour démarrer le jeu
    const startGameHandler = async () => {
        // Cacher le bouton start
        startButton.visible = false;

        // Lancer le jeu
        STATE_MENU.play = true;
        STATE_MENU.pause = false;
        STATE_MENU.gameOver = false;
        startGame(app, () => {
            // Callback appelé quand le joueur est touché
            STATE_MENU.gameOver = true;
            resetButton.visible = true;
            app.renderer.render(app.stage);
        });
    };

    // Gérer le clic sur le bouton start
    startButton.on("pointerdown", async () => {
        console.log("okay tu as clique dans el addeventlistener");
        await startGameHandler();
    });

    // Gérer le clic sur le bouton reset
    resetButton.on("pointerdown", () => {
        console.log("Reset du jeu - Rechargement de la page");

        // Recharger la page pour tout réinitialiser
        window.location.reload();
    });

    // Gérer la touche Echap pour la pause
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && STATE_MENU.play && !STATE_MENU.gameOver) {
            STATE_MENU.pause = !STATE_MENU.pause;

            if (STATE_MENU.pause) {
                // Mettre en pause
                app.ticker.stop();
                pauseIcon.visible = true;
                resetButton.visible = true;

                // FORCER le rendu après l'arrêt du ticker
                app.renderer.render(app.stage);
            } else {
                // Reprendre le jeu
                pauseIcon.visible = false;
                resetButton.visible = false;
                app.ticker.start();
            }
        }
    });

    // Gérer le game over
    if (STATE_MENU.gameOver) {
        startButton.visible = true;
    }
}