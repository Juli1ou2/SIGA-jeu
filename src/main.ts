import { Application } from "pixi.js";
import { Parameters } from "./parameters";
import {launchMenu} from "./menu/menu.ts";

// Create a PixiJS application.
const app = new Application();

// Asynchronous IIFE
(async () => {
  // Intialize the application.
  await app.init({ background: Parameters.BACKGROUND_COLOR, resizeTo: window });

  // Then adding the application's canvas to the DOM body.
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  launchMenu(app)
})();
