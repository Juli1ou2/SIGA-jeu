import { Application, Graphics } from "pixi.js";
import playerSvg from "/assets/player.svg?raw";

export function addPlayer(app: Application) {
  const graphics = new Graphics().svg(playerSvg);

  graphics.x = app.screen.width / 2 + 100;
  graphics.y = app.screen.height / 8;

  app.stage.addChild(graphics);
}
