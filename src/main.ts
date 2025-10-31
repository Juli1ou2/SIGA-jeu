import { Application, Assets, Bounds } from "pixi.js";
import { Parameters } from "./parameters";
import { Player } from "./entities/player";
import { PlayerController } from "./controllers/player.controller";
import { addAsteroids } from "./decor/asteroid.ts";
import { addStars } from "./decor/stars.ts";
import { Shooting } from "./shooting.ts";
import { Scene } from "./decor/scene.ts";
import { Enemy } from "./entities/enemies.ts";
import { Score } from "./interface/score.ts";

const app = new Application();

// Asynchronous IIFE
(async () => {
  await app.init({ background: Parameters.BACKGROUND_COLOR, resizeTo: window });

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  let points = 0;
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

  // launchMenu(app)
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

    enemy.enemies = enemy.enemies.filter((e) => {
      if (
        rectsIntersection(
          player.viewContainer.getBounds(),
          e.sprite.getBounds()
        )
      ) {
        console.log("💥 Joueur touché !");
      }

      const hitBulletIndex = shooting.bullets.findIndex((b) =>
        rectsIntersection(b.getBounds(), e.sprite.getBounds())
      );
      if (hitBulletIndex !== -1) {
        points += Parameters.ENEMY_POINTS;
        score.setText(points);
        e.sprite.destroy();
        shooting.bullets[hitBulletIndex].destroy();
        shooting.bullets.splice(hitBulletIndex, 1);
        return false;
      }
      return true;
    });

    shooting.update();
    scene.update();
  });
})();

function rectsIntersection(aBounds: Bounds, bBounds: Bounds) {
  return (
    aBounds.x + aBounds.width > bBounds.x &&
    aBounds.x < bBounds.x + bBounds.width &&
    aBounds.y + aBounds.height > bBounds.y &&
    aBounds.y < bBounds.y + bBounds.height
  );
}
