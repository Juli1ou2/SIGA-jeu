import { Application, Graphics } from "pixi.js";
import { Player } from "./entities/player";
import { Parameters } from "./parameters";

export class Shooting {
  app: Application;
  player: Player;
  bullets: Graphics[];

  constructor(app: Application, player: Player) {
    this.app = app;
    this.player = player;
    this.bullets = [];
  }

  fire() {
    const bullet = new Graphics()
      .circle(0, 0, Parameters.BULLET_RADIUS)
      .fill(Parameters.BULLET_COLOR);
    bullet.position.set(this.player.getX(), this.player.getY());
    this.bullets.push(bullet);
    this.app.stage.addChild(bullet);
  }

  update() {
    this.bullets.forEach((b) =>
      b.position.set(b.position.x + Parameters.BULLET_SPEED, b.position.y)
    );
  }
}
