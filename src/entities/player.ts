import { Container, Graphics, Rectangle } from "pixi.js";
import playerSvg from "/assets/player.svg?raw";
import { Parameters } from "../parameters";

export class Player {
  view: Container;
  graphics: Graphics;
  screen: Rectangle

  constructor(_screen: Rectangle) {
    this.view = new Container();
    this.screen = _screen;

    this.graphics = new Graphics().svg(playerSvg);
    this.graphics.x = _screen.width / 2 - 250;
    console.log("height!!", this.view.height);
    this.graphics.y = _screen.height / 2 + this.view.height;
    
    this.view.addChild(this.graphics);
  }
  
  willBeTooHigh(): boolean {
    console.log("1screen height:", this.screen.height, "y: ", this.graphics.y);
    console.log("getSize():", this.view.getSize());
    return this.graphics.y + this.view.height - Parameters.PLAYER_SPEED <= 0 ? true : false;
  }
  
  willBeTooLow(): boolean {
    console.log("2screen height:", this.screen.height, "y: ", this.graphics.y);
    console.log("getSize():", this.view.getSize());
    return this.graphics.y + Parameters.PLAYER_SPEED >= this.screen.height ? true : false;
  }
}
