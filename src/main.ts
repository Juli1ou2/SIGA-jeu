import { Application } from "pixi.js";
import { addStars } from "./decor/stars";
import { Parameters } from "./parameters";
import { Player } from "./entities/player";

// Create a PixiJS application.
const app = new Application();

// Asynchronous IIFE
(async () => {
  // Intialize the application.
  await app.init({ background: Parameters.BACKGROUND_COLOR, resizeTo: window });

  // Then adding the application's canvas to the DOM body.
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  addStars(app);
  const player = new Player(app.screen);
  app.stage.addChild(player.view);
})();
