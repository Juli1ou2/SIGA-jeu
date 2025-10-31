import { Container, Graphics, Rectangle, Texture, TilingSprite } from "pixi.js";

export class Scene {
  viewContainer: Container;
  screen: Rectangle;
  // sky: Sprite;
  // scale: number;
  background: TilingSprite;
  midground: TilingSprite;
  // floorHeight: number;

  constructor(_screen: Rectangle) {
    this.viewContainer = new Container();
    this.screen = _screen;

    // Create the stationary sky that fills the entire screen.
    // this.sky = Sprite.from("sky");
    // this.sky.anchor.set(0, 1);
    // this.sky.width = _screen.width;
    // this.sky.height = _screen.height;

    // Create textures for the background, mid-ground, and platform.
    const backgroundTexture = Texture.from("background-planet");
    const midgroundTexture = Texture.from("midground-planet");

    // Calculate the ideal platform height depending on the passed-in screen height.
    // const maxHeight = backgroundTexture.height;
    // const height = Math.min(maxHeight, _screen.height * 0.4);

    // Calculate the scale to be apply to all tiling textures for consistency.
    // const scale = (this.scale = height / maxHeight);

    const baseOptions = {
      tileScale: { x: 1, y: 1 },
      anchor: { x: 0, y: 1 },
      applyAnchorToTexture: true,
    };

    // Create the tiling sprite layers.
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

    // Calculate the floor height for external referencing.
    // this.floorHeight = height * 0.43;

    // Position the backdrop layers.
    this.background.y = 0;
    this.midground.y = 0;

    const graphics = new Graphics().rect(0, 0, 72, 72).fill('red');

    // Add all layers to the main view.
    this.viewContainer.addChild(this.background, this.midground, graphics);
  }
}
