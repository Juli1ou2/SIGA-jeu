import { Application, Assets } from "pixi.js";
import { Parameters } from "./parameters";
import {launchMenu} from "./menu/menu.ts";
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
    {
      alias: 'start-button',
      src: 'assets/start-button.png',
    },
    {
      alias: 'reset-button',
      src: 'assets/reset-button.png',
    },
    {
      alias: 'pause-button',
      src: 'assets/pause-button.png',
    },
  ]);
  
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

  launchMenu(app)
})();
