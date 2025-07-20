import { Bullet } from "../../../core/src/entity/Bullet";
import type { ClientGame } from "../ClientGame";
import { AtlasManager } from "./AtlasManager";

export class GameRenderer {
  private ctx;
  private display;
  private stars;
  private atlasManager: AtlasManager;

  constructor(
    ctx: CanvasRenderingContext2D,
    display: { startWidth: number; aspectRatio: number[]; scale: number },
    game: ClientGame,
    atlasManager: AtlasManager,
  ) {
    this.ctx = ctx;
    this.display = display;
    this.stars = game.stars;
    this.atlasManager = atlasManager;
  }

  public drawGame(game: ClientGame) {
    const currentTimestamp = Date.now();
    if(game.stats.lastFrameSecondTimestamp + 1000 < currentTimestamp) {
      game.stats.lastFrameSecondTimestamp = currentTimestamp;
      game.stats.fps = game.stats.framesThisSecond;
      game.stats.framesThisSecond = 1;
    } else game.stats.framesThisSecond++;

    this.resize();
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.fillStyle = "#03050cff";
    this.ctx.fillRect(0, 0, 10000, 10000);

    this.ctx.fillStyle = "#fff";
    for (let i = 0; i < this.stars.length; i++) {
      if (this.stars[i].x + game.camera.x / this.stars[i].z! > 1300) {
        this.stars[i].x -= 1330;
      }
      if (this.stars[i].x + game.camera.x / this.stars[i].z! < -30) {
        this.stars[i].x += 1330;
      }
      if (this.stars[i].y + game.camera.y / this.stars[i].z! > 740) {
        this.stars[i].y -= 770;
      }
      if (this.stars[i].y + game.camera.y / this.stars[i].z! < -30) {
        this.stars[i].y += 770;
      }
      this.ctx.fillRect(
        this.stars[i].x + game.camera.x / this.stars[i].z!,
        this.stars[i].y + game.camera.y / this.stars[i].z!,
        7 - this.stars[i].z! / 2,
        7 - this.stars[i].z! / 2,
      );
    }

    // // Update and draw asteroids
    // game.updateAsteroids();

    // === ASTEROID CODE ===
    /*if (this.atlasManager.areAllLoaded()) {
      for (let i = 0; i < game.asteroids.length; i++) {
        const asteroid = game.asteroids[i];

        // Save context
        this.ctx.save();

        // Transform to asteroid position
        this.ctx.translate(
          asteroid.x + game.camera.x,
          asteroid.y + game.camera.y,
        );
        this.ctx.rotate((asteroid.rotation * Math.PI) / 180);
        this.ctx.scale(asteroid.size, asteroid.size);

        // Draw asteroid
        this.atlasManager.drawTexture(
          "entities",
          "asteroid",
          this.ctx,
          -16, // Center the 32x32 sprite
          -16,
        );

        // Restore context
        this.ctx.restore();
      }
    } else {
      // Fallback: draw simple circles for asteroids
      this.ctx.fillStyle = "#666666";
      for (let i = 0; i < game.asteroids.length; i++) {
        const asteroid = game.asteroids[i];
        this.ctx.beginPath();
        this.ctx.arc(
          asteroid.x + game.camera.x,
          asteroid.y + game.camera.y,
          16 * asteroid.size,
          0,
          2 * Math.PI,
        );
        this.ctx.fill();
      }
    }*/

    // Draw player ship using texture atlas
    this.ctx.translate(game.camera.x, game.camera.y);
    // this.ctx.translate(game.myPlayer.x, game.myPlayer.y);
    // this.ctx.rotate(-((game.myPlayer.rotation * Math.PI) / 180));
    //       const shipTexture = game.myPlayer.shipSprite;

    //       this.atlasManager.drawTexture(
    //         "entities",
    //         shipTexture,
    //         this.ctx,
    //         -16, // Center the 32x32 sprite
    //         -16,
    //       );
    // console.log(game.players)
    this.ctx.font = "48px serif";
    this.ctx.textAlign = "center";
    this.ctx.fillText(`${game.players.length} person is connected`, 0, -100);

    for (let i = game.players.length - 1; i >= 0; i--) {
      for (let a = 0; a < game.players[i].flames.length; a++) {
        this.ctx.translate(
          game.players[i].flames[a].x,
          game.players[i].flames[a].y,
        );
        this.ctx.rotate(
          -((game.players[i].flames[a].rotation! * Math.PI) / 180),
        );
        this.ctx.fillStyle = `rgb(${70 * game.players[i].flames[a].size! + 10},${(50 * game.players[i].flames[a].size!) / 2 + 30},10)`;
        this.ctx.fillRect(
          -game.players[i].flames[a].size! / 2,
          -game.players[i].flames[a].size! / 2,
          game.players[i].flames[a].size!,
          game.players[i].flames[a].size!,
        );
        this.ctx.rotate((game.players[i].flames[a].rotation! * Math.PI) / 180);
        this.ctx.translate(
          -game.players[i].flames[a].x,
          -game.players[i].flames[a].y,
        );
      }
      const bullets = game.entities.filter(
        (entity) => entity instanceof Bullet,
      );
      for (let a = 0; a < bullets.length; a++) {
        this.ctx.translate(bullets[a].x, bullets[a].y);
        this.ctx.fillStyle = `#ffffaa`;
        this.ctx.fillRect(-5, -5, 10, 10);
        this.ctx.translate(-bullets[a].x, -bullets[a].y);
      }

      // // Choose texture based on engine state and selected ship
      // const shipTexture = game.myPlayer.engineActive
      //   ? game.myPlayer.shipEngineSprite
      //   : game.myPlayer.shipSprite;
      // this.ctx.translate(game.camera.x, game.camera.y);
      this.ctx.translate(game.players[i].x, game.players[i].y);
      this.ctx.fillStyle = `#aaaaaa77`;
      this.ctx.fillRect(-52, -52, 104, 14);
      this.ctx.fillStyle = `#ffffaa77`;
      this.ctx.fillRect(
        -50,
        -50,
        (100 / game.players[i].MaxHP) * game.players[i].HP,
        10,
      );
      this.ctx.rotate(-((game.players[i].rotation * Math.PI) / 180));

      // Apply 3  x scale for player ship
      this.ctx.scale(3, 3);

      // Check if atlas is loaded before drawing
      if (this.atlasManager.areAllLoaded()) {
        // Choose texture based on engine state and selected ship
        // const shipTexture = game.players[i].engineActive
        //   ? game.players[i].shipEngineSprite
        //   : game.players[i].shipSprite;
        const shipTexture = game.players[i].shipSprite;

        this.atlasManager.drawTexture(
          "entities",
          shipTexture,
          this.ctx,
          -16, // Center the 32x32 sprite
          -16,
        );
      } else {
        // Fallback: draw a simple rectangle while atlas loads
        console.log("Atlas not loaded, showing green rectangle");
        this.ctx.fillStyle = "#00ff00";
        this.ctx.fillRect(-16, -16, 32, 32);
      }

      // Reset scale after drawing
      this.ctx.scale(1 / 3, 1 / 3);
      this.ctx.rotate((game.players[i].rotation * Math.PI) / 180);
      this.ctx.translate(-game.players[i].x, -game.players[i].y);

      // Reset scale after drawing
      // this.ctx.scale(0.5, 0.5);

      // this.ctx.rotate((game.myPlayer.rotation * Math.PI) / 180);
      // this.ctx.translate(-game.myPlayer.x, -game.myPlayer.y);
    }
    this.ctx.translate(-game.camera.x, -game.camera.y);

    if (game.debug.info) {
      const fontSize = 20;
      this.ctx.font = `${fontSize}px serif`;
      this.ctx.textAlign = "left";
      this.ctx.fillStyle = "#fff9";
      const debugList = [];

      debugList.push(`FPS:${game.stats.fps} `);
      debugList.push(`TPS:${game.stats.tps} (client) `);
      debugList.push(`X:${Math.round(game.myPlayer.x)} `);
      debugList.push(`Y:${Math.round(game.myPlayer.y)} `);
      debugList.push(`R:${Math.round(game.myPlayer.rotation)} `);
      debugList.push(`VelX:${Math.round(game.myPlayer.velX)} `);
      debugList.push(`VelY:${Math.round(game.myPlayer.velY)} `);
      debugList.push(`VelR:${Math.round(game.myPlayer.velR)} `);
      debugList.push(`HP:${game.myPlayer.HP} / ${game.myPlayer.MaxHP} `);
      debugList.push(`${game.players.length} person is connected`);

      for (let i = 0; i < debugList.length; i++) {
        this.ctx.fillText(`${debugList[i]}`, 0, (i + 1) * fontSize);
      }
    }
    // this.ctx.scale(
    //   .7,.7
    // );
    // this.ctx.translate(1280/2, 720/2);
  }

  private resize() {
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height =
      (this.display.aspectRatio[1] * window.innerWidth) /
      this.display.aspectRatio[0];
    if (this.ctx.canvas.height > window.innerHeight) {
      this.ctx.canvas.height = window.innerHeight;
      this.ctx.canvas.width =
        (this.display.aspectRatio[0] * window.innerHeight) /
        this.display.aspectRatio[1];
    }
    this.ctx.scale(
      this.ctx.canvas.width / this.display.startWidth,
      this.ctx.canvas.width / this.display.startWidth,
    );
    this.display.scale = this.ctx.canvas.width / this.display.startWidth;
  }
}
