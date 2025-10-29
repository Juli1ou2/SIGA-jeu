import { Application, Graphics } from "pixi.js";
import asteroidSvg from '/assets/asteroid.svg?raw';

export function addAsteroids(app: Application) {
    const asteroidCount = 20;
    const allAsteroidsGraphics = new Graphics();

    for (let index = 0; index < asteroidCount; index++) {
        const asteroidGraphics = new Graphics().svg(asteroidSvg);

        asteroidGraphics.x = (index * 0.78695 * app.screen.width) % app.screen.width;
        asteroidGraphics.y = (index * 0.9382 * app.screen.height) % app.screen.height;

        allAsteroidsGraphics.addChild(asteroidGraphics);
    }
    app.stage.addChild(allAsteroidsGraphics);
}