import { Application, Assets } from "pixi.js";
import { addStars } from "./decor/stars";
import { Parameters } from "./parameters";
import { Player } from "./entities/player";
import { PlayerController } from "./controllers/player.controller";

const app = new Application();

// Asynchronous IIFE
(async () => {
  await app.init({ background: Parameters.COLOR_BACKGROUND, resizeTo: window });

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  await Assets.load([
    {
      alias: 'player',
      src: 'assets/player.png',
    },
  ]);

  addStars(app);

  const playerController = new PlayerController();
  const player = new Player(app.screen);
  app.stage.addChild(player.viewContainer);
  
  app.ticker.add((_time) => {
    if (playerController.keys.up.pressed && !player.willBeTooHigh()) {
      player.viewContainer.y -= Parameters.PLAYER_SPEED;
    }
    if (playerController.keys.down.pressed && !player.willBeTooLow()) {
      player.viewContainer.y += Parameters.PLAYER_SPEED;
    }
  });  
})();
