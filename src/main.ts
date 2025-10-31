import { Application, Assets, Bounds } from "pixi.js";
import { Parameters } from "./parameters";
import { Player } from "./entities/player";
import { PlayerController } from "./entities/player.controller.ts";
import { addAsteroids } from "./decor/asteroid.ts";
import { addStars } from "./decor/stars.ts";
import { Shooting } from "./shooting.ts";
import { Scene } from "./decor/scene.ts";
import { Enemy } from "./entities/enemies.ts";
import { Score } from "./interface/score.ts";
import { launchMenu } from "./interface/menu.ts";

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

  launchMenu(app);
})();

export function startGame(app: Application, onGameOver?: () => void) {
  let points = 0;

  addStars(app);

  const scene = new Scene(app.screen);
  app.stage.addChild(scene.viewContainer);

  addAsteroids(app);

  const enemy = new Enemy(app);

  const playerController = new PlayerController();
  const player = new Player(app.screen);
  app.stage.addChild(player.viewContainer);
  const shooting = new Shooting(app, player);

  const score = new Score(points, Parameters.MAIN_COLOR);
  app.stage.addChild(score.text);

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

    for (let i = enemy.enemies.length - 1; i >= 0; i--) {
      const e = enemy.enemies[i];

      if (
        rectsIntersection(
          player.viewContainer.getBounds(),
          e.sprite.getBounds()
        )
      ) {
        console.log("💥 Joueur touché !");
        player.graphics.destroy();
        enemy.setGameOver();
        app.ticker.stop();
        if (onGameOver) {
          onGameOver();
        }
      }

      const hitBulletIndex = shooting.bullets.findIndex((b) =>
        rectsIntersection(b.getBounds(), e.sprite.getBounds())
      );
      if (hitBulletIndex !== -1) {
        points += Parameters.ENEMY_POINTS;
        score.setText(points);
        enemy.destroyEnemy(e.sprite);
        enemy.enemies.splice(i, 1);
        shooting.bullets[hitBulletIndex].destroy();
        shooting.bullets.splice(hitBulletIndex, 1);
      }
    }

    shooting.update();
    scene.update();
  });
}

function rectsIntersection(aBounds: Bounds, bBounds: Bounds) {
  return (
    aBounds.x + aBounds.width > bBounds.x &&
    aBounds.x < bBounds.x + bBounds.width &&
    aBounds.y + aBounds.height > bBounds.y &&
    aBounds.y < bBounds.y + bBounds.height
  );
}
