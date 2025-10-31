import { Application, Sprite, Texture } from "pixi.js";
import { Parameters } from "../parameters";

export class Enemy {
  app: Application;
  enemies: { sprite: Sprite; laps: number }[] = [];
  enemyTexture?: Texture;
  tickerCallback?: () => void;

  private readonly scales = [0.5, 0.8, 1];

  constructor(app: Application) {
    this.app = app;
    this.enemyTexture = Texture.from("enemy");
    const enemiesCount = Math.floor(Math.random() * Parameters.ENEMIES_MIN_COUNT) + 5;
  
    for (let i = 0; i < enemiesCount; i++) {
      this.createEnemy();
    }
  
    this.startAnimation();
  }

  private createEnemy() {
    if (!this.enemyTexture) return;

    const scale = this.scales[Math.floor(Math.random() * this.scales.length)];
    const enemy = new Sprite(this.enemyTexture);
    enemy.anchor.set(0.5);
    enemy.scale.set(scale);

    const enemyWidth = enemy.width;
    const enemyHeight = enemy.height;

    const pos = this.getRandomPosition(enemyWidth, enemyHeight, undefined, false);
    enemy.x = pos.x;
    enemy.y = pos.y;

    this.app.stage.addChild(enemy);
    this.enemies.push({ sprite: enemy, laps: 0 });
  }

  private isPositionFree(
    x: number,
    y: number,
    width: number,
    height: number,
    excludeEnemy?: Sprite
  ): boolean {
    for (const enemyData of this.enemies) {
      const ex = enemyData.sprite;

      if (ex === excludeEnemy) continue;
      if (enemyData.laps >= Parameters.ENEMIES_LAPS) continue;

      const dx = Math.abs(x - ex.x);
      const dy = Math.abs(y - ex.y);

      const minDistX = (width + ex.width) / 2 + Parameters.ENEMY_MARGIN;
      const minDistY = (height + ex.height) / 2 + Parameters.ENEMY_MARGIN;

      if (dx < minDistX && dy < minDistY) {
        return false;
      }
    }
    return true;
  }

  private getRandomPosition(
    currentEnemyWidth: number,
    currentEnemyHeight: number,
    excludeEnemy?: Sprite,
    isRespawn: boolean = false
  ) {
    const maxAttempts = 150;

    for (let i = 0; i < maxAttempts; i++) {
      let x: number;

      if (isRespawn) {
        x = this.app.screen.width + currentEnemyWidth / 2 + Math.random() * 200;
      } else {
        x = this.app.screen.width / 2 + Math.random() * (this.app.screen.width / 2);
      }

      const y = currentEnemyHeight / 2 + Math.random() * (this.app.screen.height - currentEnemyHeight);

      if (this.isPositionFree(x, y, currentEnemyWidth, currentEnemyHeight, excludeEnemy)) {
        return { x, y };
      }
    }

    return {
      x: this.app.screen.width + currentEnemyWidth / 2 + Math.random() * 300,
      y: this.app.screen.height / 2
    };
  }

  private startAnimation() {
    this.tickerCallback = () => {
      let allFinished = true;

      for (const enemyData of this.enemies) {
        const enemy = enemyData.sprite;

        if (enemyData.laps < Parameters.ENEMIES_LAPS) {
          allFinished = false;
          enemy.x -= Parameters.ENEMY_SPEED;

          if (enemy.x < -enemy.width / 2) {
            enemyData.laps++;

            if (enemyData.laps < Parameters.ENEMIES_LAPS) {
              const scale = this.scales[Math.floor(Math.random() * this.scales.length)];
              enemy.scale.set(scale);

              const enemyWidth = enemy.width;
              const enemyHeight = enemy.height;

              const newPos = this.getRandomPosition(enemyWidth, enemyHeight, enemy, true);
              enemy.x = newPos.x;
              enemy.y = newPos.y;
            }
          }
        }
      }

      if (allFinished) {
        this.stopAnimation();
        console.log("Animation des ennemis terminée !");
      }
    };

    this.app.ticker.add(this.tickerCallback);
  }

  private stopAnimation() {
    if (this.tickerCallback) {
      this.app.ticker.remove(this.tickerCallback);
      this.tickerCallback = undefined;
    }
  }

  destroy() {
    this.stopAnimation();
    for (const enemyData of this.enemies) {
      enemyData.sprite.destroy();
    }
    this.enemies = [];
  }
}