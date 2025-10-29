import { Container, Graphics, Rectangle } from "pixi.js";
import playerSvg from "/assets/player.svg?raw";

export class Player {
  view: Container;
  graphics: Graphics;

  constructor(screen: Rectangle) {
    this.view = new Container();

    this.graphics = new Graphics().svg(playerSvg);
    this.graphics.x = screen.width / 2 + 100;
    this.graphics.y = screen.height / 8;

    this.view.addChild(this.graphics);
  }
}
