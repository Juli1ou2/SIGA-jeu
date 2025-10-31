import { Container, Graphics, Rectangle, Texture, TilingSprite } from "pixi.js";

export class Scene {
  viewContainer: Container;
  screen: Rectangle;
  background: TilingSprite;
  midground: TilingSprite;

  constructor(_screen: Rectangle) {
    this.viewContainer = new Container();
    this.screen = _screen;

    const backgroundTexture = Texture.from("background-planet");
    const midgroundTexture = Texture.from("midground-planet");

    const baseOptions = {
      tileScale: { x: 1, y: 1 },
      anchor: { x: 0, y: 1 },
      applyAnchorToTexture: true,
    };

    this.background = new TilingSprite({
      texture: backgroundTexture,
      width: this.screen.width,
      height: backgroundTexture.height * 1,
      ...baseOptions,
    });
    this.midground = new TilingSprite({
      texture: midgroundTexture,
      width: this.screen.width,
      height: midgroundTexture.height * 1,
      ...baseOptions,
    });

    this.background.y = 0;
    this.midground.y = 0;

    const graphics = new Graphics().rect(0, 0, 72, 72).fill("red");

    this.viewContainer.addChild(this.background, this.midground, graphics);
    this.viewContainer.y = _screen.height;
  }

  update() {
    this.background.tilePosition.x -= 0.4;
    this.midground.tilePosition.x -= 1.2;
  }
}
