import { Application, Assets, Sprite } from "pixi.js";

export async function addEnemies(app: Application) {
  const enemyTexture = await Assets.load("assets/enemy.svg");
  const enemiesCount = Math.floor(Math.random() * 17) + 5;
  const enemies: { sprite: Sprite; laps: number }[] = [];

  const speed = 5;
  const maxLaps = 10;
  const scales = [0.5, 0.8, 1];
  const margin = 30; // Marge de sécurité entre les ennemis

  // Fonction pour vérifier si une position est libre
  function isPositionFree(
      x: number,
      y: number,
      width: number,
      height: number,
      excludeEnemy?: Sprite
  ): boolean {
    for (const enemyData of enemies) {
      const ex = enemyData.sprite;

      // Ignorer l'ennemi en cours de repositionnement
      if (ex === excludeEnemy) continue;

      // Ignorer les ennemis qui ont terminé leurs tours
      if (enemyData.laps >= maxLaps) continue;

      // Vérifier le chevauchement rectangulaire
      const dx = Math.abs(x - ex.x);
      const dy = Math.abs(y - ex.y);

      const minDistX = (width + ex.width) / 2 + margin;
      const minDistY = (height + ex.height) / 2 + margin;

      if (dx < minDistX && dy < minDistY) {
        return false;
      }
    }
    return true;
  }

  // Fonction pour générer une position aléatoire sans chevauchement
  function getRandomPosition(
      currentEnemyWidth: number,
      currentEnemyHeight: number,
      excludeEnemy?: Sprite,
      isRespawn: boolean = false
  ) {
    const maxAttempts = 150;

    for (let i = 0; i < maxAttempts; i++) {
      let x: number;

      if (isRespawn) {
        // Pour le respawn, placer à droite de l'écran
        x = app.screen.width + currentEnemyWidth / 2 + Math.random() * 200;
      } else {
        // Pour la création initiale
        x = app.screen.width / 2 + Math.random() * (app.screen.width / 2);
      }

      const y = currentEnemyHeight / 2 + Math.random() * (app.screen.height - currentEnemyHeight);

      if (isPositionFree(x, y, currentEnemyWidth, currentEnemyHeight, excludeEnemy)) {
        return { x, y };
      }
    }

    // Position de secours si aucune position libre trouvée
    return {
      x: app.screen.width + currentEnemyWidth / 2 + Math.random() * 300,
      y: app.screen.height / 2
    };
  }

  // Créer les ennemis avec des positions non chevauchantes
  for (let i = 0; i < enemiesCount; i++) {
    const scale = scales[Math.floor(Math.random() * scales.length)];
    const enemy = new Sprite(enemyTexture);
    enemy.anchor.set(0.5);
    enemy.scale.set(scale);

    const enemyWidth = enemy.width;
    const enemyHeight = enemy.height;

    const pos = getRandomPosition(enemyWidth, enemyHeight, undefined, false);
    enemy.x = pos.x;
    enemy.y = pos.y;

    app.stage.addChild(enemy);
    enemies.push({ sprite: enemy, laps: 0 });
  }

  // Boucle d'animation
  const tickerCallback = () => {
    let allFinished = true;

    for (const enemyData of enemies) {
      const enemy = enemyData.sprite;

      if (enemyData.laps < maxLaps) {
        allFinished = false;
        enemy.x -= speed;

        // Si l'ennemi sort à gauche
        if (enemy.x < -enemy.width / 2) {
          enemyData.laps++;

          if (enemyData.laps < maxLaps) {
            // Nouvelle échelle aléatoire
            const scale = scales[Math.floor(Math.random() * scales.length)];
            enemy.scale.set(scale);

            const enemyWidth = enemy.width;
            const enemyHeight = enemy.height;

            // Trouver une position libre en excluant cet ennemi de la vérification
            const newPos = getRandomPosition(enemyWidth, enemyHeight, enemy, true);
            enemy.x = newPos.x;
            enemy.y = newPos.y;
          }
        }
      }
    }

    if (allFinished) {
      app.ticker.remove(tickerCallback);
      console.log("Animation terminée après 10 tours !");
    }
  };

  app.ticker.add(tickerCallback);
}