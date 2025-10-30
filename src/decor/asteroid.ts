import { Application, Graphics, Container, Ticker } from "pixi.js";
import asteroidSvg from "/assets/asteroid.svg?raw";

// Map pour stocker la vitesse de rotation de chaque astéroïde
const rotationSpeeds = new WeakMap<Graphics, number>();

// Tailles et paramètres généraux
const SCALES = [1, 2.0, 3.5];

// Vitesse du "tapis roulant" (groupes) en px/s
const GROUP_SPEED_PX_S = 200; // ↑ augmente si tu veux aller plus vite

// Vitesse des astéroïdes spawnés (facteur * group speed)
const SPAWN_SPEED_FACTOR = 1.15; // ils filent un peu plus vite que le tapis

// Espacement horizontal voulu entre deux spawns (en pixels)
const DESIRED_SPACING_PX = 220;

// Marge hors écran pour spawn/despawn
const DESPAWN_MARGIN = 80;

export function addAsteroids(app: Application) {
  const ASTEROID_COUNT = 20;

  const group1 = createAsteroidsGroup(app, ASTEROID_COUNT);
  const group2 = createAsteroidsGroup(app, ASTEROID_COUNT);
  group2.x = app.screen.width;

  // Calque d’apparition continue
  const spawnLayer = new Container();
  app.stage.addChild(group1, group2, spawnLayer);

  // Timer de spawn basé sur l’espacement voulu
  // Intervalle = distance / vitesse
  const spawnSpeedPxS = GROUP_SPEED_PX_S * SPAWN_SPEED_FACTOR;
  let spawnIntervalMs = (DESIRED_SPACING_PX / spawnSpeedPxS) * 1000;
  let spawnAccumulator = 0;

  app.ticker.add((ticker: Ticker) => {
    const dtMs = ticker.deltaMS;
    const dt = dtMs / 1000;
    const w = app.screen.width;
    const h = app.screen.height;

    // Déplacement global des groupes (droite -> gauche)
    const groupDx = GROUP_SPEED_PX_S * dt; // px à soustraire
    group1.x -= groupDx;
    group2.x -= groupDx;

    // Rotation (groupes + spawnLayer)
    for (const group of [group1, group2, spawnLayer]) {
      for (const child of group.children) {
        const a = child as Graphics;
        const rot = rotationSpeeds.get(a) ?? 0;
        a.rotation += rot * ticker.deltaTime; // on garde ton choix (rad/frame)
      }
    }

    // Recyclage des groupes
    if (group1.x <= -w) group1.x += w * 2;
    if (group2.x <= -w) group2.x += w * 2;

    // SPawn continu : intervalle basé sur l'espacement voulu et la vitesse réelle
    spawnAccumulator += dtMs;
    while (spawnAccumulator >= spawnIntervalMs) {
      spawnAccumulator -= spawnIntervalMs;

      const a = createOneAsteroid();
      // spawn juste à droite de l'écran à une hauteur aléatoire
      a.x = w + DESPAWN_MARGIN;
      a.y = Math.random() * h;
      spawnLayer.addChild(a);
    }

    // Déplacement des astéroïdes spawnés + cleanup
    const spawnedDx = spawnSpeedPxS * dt;
    for (let i = spawnLayer.children.length - 1; i >= 0; i--) {
      const a = spawnLayer.children[i] as Graphics;
      a.x -= spawnedDx;
      if (a.x < -DESPAWN_MARGIN) {
        a.destroy();
        spawnLayer.removeChildAt(i);
      }
    }
  });
}

/**
 * Groupe initial (tapissé sur l'écran) avec tailles différentes.
 */
export function createAsteroidsGroup(app: Application, count: number): Container {
  const group = new Container();

  for (let i = 0; i < count; i++) {
    const asteroid = new Graphics().svg(asteroidSvg);

    const scale = SCALES[Math.floor(Math.random() * SCALES.length)];
    asteroid.scale.set(scale);

    const bounds = asteroid.getLocalBounds();
    asteroid.pivot.set(bounds.width / 2, bounds.height / 2);

    asteroid.x = (i * 0.78695 * app.screen.width) % app.screen.width;
    asteroid.y = (i * 0.9382 * app.screen.height) % app.screen.height;

    const rotSpeed = (Math.random() - 0.5) * 0.08; // rad/frame
    rotationSpeeds.set(asteroid, rotSpeed);

    group.addChild(asteroid);
  }

  return group;
}

/**
 * Crée un astéroïde pour le spawn continu (mêmes règles que le groupe).
 */
function createOneAsteroid(): Graphics {
  const asteroid = new Graphics().svg(asteroidSvg);

  const scale = SCALES[(Math.random() * SCALES.length) | 0];
  asteroid.scale.set(scale);

  const bounds = asteroid.getLocalBounds();
  asteroid.pivot.set(bounds.width / 2, bounds.height / 2);

  const rotSpeed = (Math.random() - 0.5) * 0.02;
  rotationSpeeds.set(asteroid, rotSpeed);

  return asteroid;
}
