import { Application, Graphics } from "pixi.js";
import { Player } from "./entities/player";
import { Parameters } from "./parameters";

export class Shooting {
  app: Application;
  player: Player;
  bullets: Graphics[];
  lastShotTime: number;

  constructor(app: Application, player: Player) {
    this.app = app;
    this.player = player;
    this.bullets = [];
    this.lastShotTime = 0;
  }

  fire() {
    const now = performance.now();
    if (now - this.lastShotTime < Parameters.BULLET_COOLDOWN) return;
    this.lastShotTime = now;

    if (this.bullets.length >= Parameters.BULLET_MAX) {
      let b = this.bullets.shift() as Graphics;
      this.app.stage.removeChild(b);
    }
    this.bullets = this.bullets.filter(
      (b) => b.position.x < this.app.screen.width
    );

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
