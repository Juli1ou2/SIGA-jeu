import { Application } from "pixi.js";
import { addStars } from "./decor/stars";
import { Parameters } from "./parameters";
import { Player } from "./entities/player";
import { PlayerController } from "./controllers/player.controller";

const app = new Application();

// Asynchronous IIFE
(async () => {
  await app.init({ background: Parameters.COLOR_BACKGROUND, resizeTo: window });

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  addStars(app);

  const playerController = new PlayerController();
  const player = new Player(app.screen);
  app.stage.addChild(player.view);

  app.ticker.add((_time) => {
    if (playerController.keys.up.pressed && !player.willBeTooHigh()) {
      player.graphics.y -= Parameters.PLAYER_SPEED;
    }
    if (playerController.keys.down.pressed && !player.willBeTooLow()) {
      player.graphics.y += Parameters.PLAYER_SPEED;
    }
  });
})();
