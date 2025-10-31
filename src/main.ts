import { Application, Assets, Sprite } from "pixi.js";
import { Parameters } from "./parameters";
import { launchMenu } from "./menu/menu.ts";
import { Player } from "./entities/player";
import { PlayerController } from "./controllers/player.controller";
import { addAsteroids } from "./decor/asteroid.ts";
import { addStars } from "./decor/stars.ts";
import { addEnemies } from "./entities/enemies.ts";
import { Shooting } from "./shooting.ts";
import { Scene } from "./decor/scene.ts";

const app = new Application();

// Asynchronous IIFE
(async () => {
  await app.init({ background: Parameters.BACKGROUND_COLOR, resizeTo: window });

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  await Assets.load([
    {
      alias: "player",
      src: "assets/player.png",
    },
    {
      alias: "start-button",
      src: "assets/start-button.png",
    },
    {
      alias: "reset-button",
      src: "assets/reset-button.png",
    },
    {
      alias: "pause-button",
      src: "assets/pause-button.png",
    },
    {
      alias: "enemy",
      src: "assets/enemy.svg",
    },
    {
      alias: "background-planet",
      src: "assets/back-planet.png",
    },
    {
      alias: "midground-planet",
      src: "assets/front-planet.png",
    },
  ]);
  
  addStars(app);

  const scene = new Scene(app.screen);
  app.stage.addChild(scene.viewContainer);

  const playerController = new PlayerController();
  const player = new Player(app.screen);
  app.stage.addChild(player.viewContainer);
  const shooting = new Shooting(app, player);

  app.ticker.add((_time) => {
    if (playerController.keys.up.pressed && !player.willBeTooHigh()) {
      player.viewContainer.y -= Parameters.PLAYER_SPEED;
    }
    if (playerController.keys.down.pressed && !player.willBeTooLow()) {
      player.viewContainer.y += Parameters.PLAYER_SPEED;
    }
    if (playerController.keys.space.pressed) {
      shooting.fire();
    }
    shooting.update();
    scene.update();
  });

  // launchMenu(app)
  addAsteroids(app);
  addEnemies(app);
})();
