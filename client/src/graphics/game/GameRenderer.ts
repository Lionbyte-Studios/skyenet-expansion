import type { Entity } from "../../../../core/src/entity/Entity";
import type { RenderInfo } from "../../ClientManager";
import { ClientPlayer } from "../../entity/ClientPlayer";
import { clientManager } from "../../Main";

export class GameRenderer {
  private stars;

  constructor(renderInfo: RenderInfo) {
    if (renderInfo.game === undefined) {
      throw new Error(
        "renderInfo.game is undefined; cannot construct GameRenderer.",
      );
    }
    this.stars = renderInfo.game.stars;
  }

  public drawGame(renderInfo: RenderInfo) {
    if (renderInfo.game === undefined) {
      console.error("renderInfo.game is undefined; cannot draw game.");
      return;
    }
    const currentTimestamp = Date.now();
    if (
      renderInfo.game.stats.lastFrameSecondTimestamp + 1000 <
      currentTimestamp
    ) {
      renderInfo.game.stats.lastFrameSecondTimestamp = currentTimestamp;
      renderInfo.game.stats.fps = renderInfo.game.stats.framesThisSecond;
      renderInfo.game.stats.framesThisSecond = 1;
    } else renderInfo.game.stats.framesThisSecond++;

    this.resize(renderInfo);
    renderInfo.ctx.imageSmoothingEnabled = false;
    renderInfo.ctx.fillStyle = "#03050cff";
    renderInfo.ctx.fillRect(0, 0, 10000, 10000);

    renderInfo.ctx.fillStyle = "#fff";
    for (let i = 0; i < this.stars.length; i++) {
      if (
        this.stars[i].x + renderInfo.game.camera.x / this.stars[i].z! >
        1300
      ) {
        this.stars[i].x -= 1330;
      }
      if (this.stars[i].x + renderInfo.game.camera.x / this.stars[i].z! < -30) {
        this.stars[i].x += 1330;
      }
      if (this.stars[i].y + renderInfo.game.camera.y / this.stars[i].z! > 740) {
        this.stars[i].y -= 770;
      }
      if (this.stars[i].y + renderInfo.game.camera.y / this.stars[i].z! < -30) {
        this.stars[i].y += 770;
      }
      renderInfo.ctx.beginPath();
      renderInfo.ctx.moveTo(
        this.stars[i].x + renderInfo.game.camera.x / this.stars[i].z!,
        this.stars[i].y + renderInfo.game.camera.y / this.stars[i].z!,
      );
      renderInfo.ctx.lineTo(
        this.stars[i].x +
          renderInfo.game.camera.x / this.stars[i].z! +
          renderInfo.game.camera.velX / 10,
        this.stars[i].y +
          renderInfo.game.camera.y / this.stars[i].z! +
          renderInfo.game.camera.velY / 10,
      );
      renderInfo.ctx.strokeStyle = "#fff";
      renderInfo.ctx.lineWidth = (7 - this.stars[i].z! / 2) / 5;
      renderInfo.ctx.stroke();
      renderInfo.ctx.closePath();
    }

    // Draw player ship using texture atlas
    renderInfo.ctx.translate(
      renderInfo.game.camera.x,
      renderInfo.game.camera.y,
    );
    renderInfo.ctx.font = "48px serif";
    renderInfo.ctx.textAlign = "center";
    const playerCount = renderInfo.game.world.getAllPlayers().length;
    renderInfo.ctx.fillText(
      `${playerCount} ${playerCount === 1 ? "player is" : "players are"} connected`,
      0,
      -100,
    );

    const renderableEntities: (Entity & {
      render: (info: RenderInfo) => void;
    })[] = renderInfo.game.findEntities(
      (entity) => "render" in entity && typeof entity.render === "function",
    ) as (Entity & { render: (info: RenderInfo) => void })[];
    renderableEntities.forEach((entity) => {
      renderInfo.ctx.save();
      entity.render(renderInfo);
      renderInfo.ctx.restore();
    });

    for (const entity of renderInfo.game.world.getAllPlayers() as ClientPlayer[]) {
      for (const flameState of entity.flamesState) {
        renderInfo.ctx.translate(flameState.x, flameState.y);
        renderInfo.ctx.rotate(-((flameState.rotation! * Math.PI) / 180));
        renderInfo.ctx.fillStyle = `rgb(${70 * flameState.size! + 10},${(50 * flameState.size!) / 2 + 30},10)`;
        renderInfo.ctx.fillRect(
          -flameState.size! / 2,
          -flameState.size! / 2,
          flameState.size!,
          flameState.size!,
        );
        renderInfo.ctx.rotate((flameState.rotation! * Math.PI) / 180);
        renderInfo.ctx.translate(-flameState.x, -flameState.y);
      }

      renderInfo.ctx.translate(entity.x, entity.y);
      renderInfo.ctx.fillStyle = `#aaaaaa77`;
      renderInfo.ctx.fillRect(-52, -52, 104, 14);
      renderInfo.ctx.fillStyle = `#ffffaa77`;
      renderInfo.ctx.fillRect(-50, -50, (100 / entity.MaxHP) * entity.HP, 10);
      renderInfo.ctx.rotate(-((entity.rotation * Math.PI) / 180));

      // Apply 3  x scale for player ship
      renderInfo.ctx.scale(3, 3);

      // Check if atlas is loaded before drawing
      if (renderInfo.atlasManager.areAllLoaded()) {
        const shipTexture = entity.shipSprite;

        renderInfo.atlasManager.drawTextureCentered(
          "entities",
          shipTexture,
          renderInfo.ctx,
          0,
          0,
        );
      } else {
        // Fallback: draw a simple rectangle while atlas loads
        console.log("Atlas not loaded, showing green rectangle");
        renderInfo.ctx.fillStyle = "#00ff00";
        renderInfo.ctx.fillRect(-16, -16, 32, 32);
      }

      // Reset scale after drawing
      renderInfo.ctx.scale(1 / 3, 1 / 3);
      renderInfo.ctx.rotate((entity.rotation * Math.PI) / 180);
      renderInfo.ctx.translate(-entity.x, -entity.y);
    }
    renderInfo.ctx.translate(
      -renderInfo.game.camera.x,
      -renderInfo.game.camera.y,
    );

    if (renderInfo.game.debug.info) {
      const fontSize = 20;
      renderInfo.ctx.font = `${fontSize}px serif`;
      renderInfo.ctx.textAlign = "left";
      renderInfo.ctx.fillStyle = "#fff9";
      const debugList = [];

      const digits = 2;
      debugList.push(`FPS:${renderInfo.game.stats.fps} `);
      debugList.push(`TPS:${renderInfo.game.stats.tps} (client) `);
      debugList.push(`X:${renderInfo.game.myPlayer.x.toFixed(digits)} `);
      debugList.push(`Y:${renderInfo.game.myPlayer.y.toFixed(digits)} `);
      debugList.push(`R:${renderInfo.game.myPlayer.rotation.toFixed(digits)} `);
      debugList.push(`VelX:${renderInfo.game.myPlayer.velX.toFixed(digits)} `);
      debugList.push(`VelY:${renderInfo.game.myPlayer.velY.toFixed(digits)} `);
      debugList.push(`VelR:${renderInfo.game.myPlayer.velR.toFixed(digits)} `);
      debugList.push(
        `HP:${renderInfo.game.myPlayer.HP} / ${renderInfo.game.myPlayer.MaxHP} `,
      );
      const playerCount = renderInfo.game.world.getAllPlayers().length;
      debugList.push(
        `${playerCount} ${playerCount === 1 ? "player is" : "players are"} connected`,
      );
      debugList.push(`E:${renderInfo.game.world.getAllEntities().length} `);

      for (let i = 0; i < debugList.length; i++) {
        renderInfo.ctx.fillText(`${debugList[i]}`, 0, (i + 1) * fontSize);
      }
    }
  }

  private resize(renderInfo: RenderInfo) {
    renderInfo.ctx.canvas.width = window.innerWidth;
    renderInfo.ctx.canvas.height =
      (renderInfo.display.aspectRatio[1] * window.innerWidth) /
      renderInfo.display.aspectRatio[0];
    if (renderInfo.ctx.canvas.height > window.innerHeight) {
      renderInfo.ctx.canvas.height = window.innerHeight;
      renderInfo.ctx.canvas.width =
        (renderInfo.display.aspectRatio[0] * window.innerHeight) /
        renderInfo.display.aspectRatio[1];
    }
    renderInfo.ctx.scale(
      renderInfo.ctx.canvas.width / renderInfo.display.startWidth,
      renderInfo.ctx.canvas.width / renderInfo.display.startWidth,
    );
    clientManager.display.scale =
      renderInfo.ctx.canvas.width / renderInfo.display.startWidth;
  }
}
