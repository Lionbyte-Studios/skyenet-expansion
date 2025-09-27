import type { Entity } from "../../../../core/src/entity/Entity";
import type { ClientGame } from "../../ClientGame";
import type { RenderInfo } from "../../entity/RenderableEntity";
import { AtlasManager } from "../AtlasManager";

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
    if (game.stats.lastFrameSecondTimestamp + 1000 < currentTimestamp) {
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
      // this.ctx.fillRect(
      //   this.stars[i].x + game.camera.x / this.stars[i].z!,
      //   this.stars[i].y + game.camera.y / this.stars[i].z!,
      //   7 - this.stars[i].z! / 2,
      //   7 - this.stars[i].z! / 2,
      // );
      this.ctx.beginPath();
      this.ctx.moveTo(
        this.stars[i].x + game.camera.x / this.stars[i].z!,
        this.stars[i].y + game.camera.y / this.stars[i].z!,
      );
      this.ctx.lineTo(
        this.stars[i].x +
          game.camera.x / this.stars[i].z! +
          game.camera.velX / 10,
        this.stars[i].y +
          game.camera.y / this.stars[i].z! +
          game.camera.velY / 10,
      );
      this.ctx.strokeStyle = "#fff";
      this.ctx.lineWidth = (7 - this.stars[i].z! / 2) / 5;
      this.ctx.stroke();
      this.ctx.closePath();
    }

    // Draw player ship using texture atlas
    this.ctx.translate(game.camera.x, game.camera.y);
    this.ctx.font = "48px serif";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      `${game.players.length} ${game.players.length === 1 ? "player is" : "players are"} connected`,
      0,
      -100,
    );

    const renderableEntities: (Entity & {
      render: (info: RenderInfo) => void;
    })[] = game.entities.filter(
      (entity) => "render" in entity && typeof entity.render === "function",
    ) as (Entity & { render: (info: RenderInfo) => void })[];
    renderableEntities.forEach((entity) => {
      entity.render({ ctx: this.ctx, game: game});
    });

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
      /*const bullets = game.entities.filter(
        (entity) => entity instanceof ClientBullet,
      );
      for (let a = 0; a < bullets.length; a++) {*/
      /*this.ctx.translate(bullets[a].x, bullets[a].y);
        this.ctx.fillStyle = `#ffffaa`;
        this.ctx.fillRect(-5, -5, 10, 10);
        this.ctx.translate(-bullets[a].x, -bullets[a].y);*/
      /*  bullets[a].render(this.ctx);
      }*/

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
    }
    this.ctx.translate(-game.camera.x, -game.camera.y);

    if (game.debug.info) {
      const fontSize = 20;
      this.ctx.font = `${fontSize}px serif`;
      this.ctx.textAlign = "left";
      this.ctx.fillStyle = "#fff9";
      const debugList = [];

      const digits = 2;
      debugList.push(`FPS:${game.stats.fps} `);
      debugList.push(`TPS:${game.stats.tps} (client) `);
      debugList.push(`X:${game.myPlayer.x.toFixed(digits)} `);
      debugList.push(`Y:${game.myPlayer.y.toFixed(digits)} `);
      debugList.push(`R:${game.myPlayer.rotation.toFixed(digits)} `);
      debugList.push(`VelX:${game.myPlayer.velX.toFixed(digits)} `);
      debugList.push(`VelY:${game.myPlayer.velY.toFixed(digits)} `);
      debugList.push(`VelR:${game.myPlayer.velR.toFixed(digits)} `);
      debugList.push(`HP:${game.myPlayer.HP} / ${game.myPlayer.MaxHP} `);
      debugList.push(
        `${game.players.length} ${game.players.length === 1 ? "player is" : "players are"} connected`,
      );

      for (let i = 0; i < debugList.length; i++) {
        this.ctx.fillText(`${debugList[i]}`, 0, (i + 1) * fontSize);
      }
    }
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
