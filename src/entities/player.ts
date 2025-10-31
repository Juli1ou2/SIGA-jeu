import { Container, Graphics, Rectangle, Texture } from "pixi.js";
import { Parameters } from "../parameters";

export class Player {
  viewContainer: Container;
  graphics: Graphics;
  screen: Rectangle;

  constructor(_screen: Rectangle) {
    const texture = Texture.from('player');
    this.viewContainer = new Container();
    this.screen = _screen;

    this.graphics = new Graphics().rect(0, 0, 72, 72).fill(texture);
    this.viewContainer.addChild(this.graphics);

    this.viewContainer.x = this.screen.width / 6;
    this.viewContainer.y = this.screen.height / 2;
    this.viewContainer.pivot.x = this.viewContainer.width / 2;
    this.viewContainer.pivot.y = this.viewContainer.height / 2;
  }

  willBeTooHigh(): boolean {
    return this.viewContainer.y -
      this.viewContainer.height / 2 -
      Parameters.PLAYER_SPEED <=
      0
      ? true
      : false;
  }

  willBeTooLow(): boolean {
    return this.viewContainer.y +
      this.viewContainer.height / 2 +
      Parameters.PLAYER_SPEED >=
      this.screen.height
      ? true
      : false;
  }

  getX(){
    return this.viewContainer.x;
  }

  getY(){
    return this.viewContainer.y;
  }
}
