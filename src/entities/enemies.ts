import { Application, Sprite, Texture } from "pixi.js";
import { Parameters } from "../parameters";

export class Enemy {
  app: Application;
  enemies: { sprite: Sprite }[] = [];
  enemyTexture?: Texture;
  tickerCallback?: () => void;
  private gameOver: boolean = false;

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

    const pos = this.getRandomPosition(enemyWidth, enemyHeight);
    enemy.x = pos.x;
    enemy.y = pos.y;

    this.app.stage.addChild(enemy);
    this.enemies.push({ sprite: enemy });
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
    excludeEnemy?: Sprite
  ) {
    const maxAttempts = 150;

    for (let i = 0; i < maxAttempts; i++) {
      const x = this.app.screen.width + currentEnemyWidth / 2 + Math.random() * 200;
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
      if (this.gameOver) return;

      for (const enemyData of this.enemies) {
        const enemy = enemyData.sprite;

        enemy.x -= Parameters.ENEMY_SPEED;

        if (enemy.x < -enemy.width / 2) {
          const scale = this.scales[Math.floor(Math.random() * this.scales.length)];
          enemy.scale.set(scale);

          const enemyWidth = enemy.width;
          const enemyHeight = enemy.height;

          const newPos = this.getRandomPosition(enemyWidth, enemyHeight, enemy);
          enemy.x = newPos.x;
          enemy.y = newPos.y;
        }
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

  public destroyEnemy(sprite: Sprite) {
    if (!this.gameOver) {
      this.createEnemy();
    }
    sprite.destroy();
  }

  public setGameOver() {
    this.gameOver = true;
  }

  destroy() {
    this.stopAnimation();
    for (const enemyData of this.enemies) {
      enemyData.sprite.destroy();
    }
    this.enemies = [];
  }
}