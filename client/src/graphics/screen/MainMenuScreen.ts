import type { RenderInfo } from "../../ClientManager";
import { clientManager } from "../../Main";
import { InGameScreen } from "./InGameScreen";
import { ClientScreen } from "./Screen";
import { ShipSelectionScreen } from "./ShipSelectionScreen";

export class MainMenuScreen extends ClientScreen {
  private mouseX: number = 0;
  private mouseY: number = 0;

  public render(renderInfo: RenderInfo): void {
    // Use base resolution for positioning (1280x720)
    const baseWidth = 1280;
    const baseHeight = 720;

    // Draw title
    renderInfo.ctx.fillStyle = "#ffffff";
    renderInfo.ctx.font = "48px Arial";
    renderInfo.ctx.textAlign = "center";
    renderInfo.ctx.fillText("SPACENET", baseWidth / 2, 100);

    // Draw menu items on the left
    renderInfo.ctx.font = "24px Arial";
    renderInfo.ctx.textAlign = "left";

    // Start Game/Resume button
    renderInfo.ctx.fillStyle = "#333333";
    renderInfo.ctx.fillRect(baseWidth * 0.1, baseHeight * 0.7, 200, 60);
    renderInfo.ctx.fillStyle = "#ffffff";
    const buttonText = clientManager.isGameRunning() ? "RESUME" : "START GAME";
    renderInfo.ctx.fillText(
      buttonText,
      baseWidth * 0.1 + 20,
      baseHeight * 0.7 + 35,
    );

    // Ship selection info
    renderInfo.ctx.font = "20px Arial";
    renderInfo.ctx.fillText(
      "Selected Ship:",
      baseWidth * 0.1,
      baseHeight * 0.3,
    );
    renderInfo.ctx.font = "16px Arial";
    renderInfo.ctx.fillText(
      clientManager.state.selectedShip.name,
      baseWidth * 0.1,
      baseHeight * 0.35,
    );
    renderInfo.ctx.fillText(
      clientManager.state.selectedShip.description,
      baseWidth * 0.1,
      baseHeight * 0.4,
    );

    // Draw ship that follows mouse (right side)
    if (renderInfo.atlasManager.areAllLoaded()) {
      // console.log("Atlas is loaded, drawing normal thing");
      renderInfo.ctx.save();

      // Calculate ship position to follow mouse but stay on right side
      // Convert mouse coordinates to base resolution
      const scale = renderInfo.canvas.width / 1280;
      const mouseXBase = this.mouseX / scale;
      const mouseYBase = this.mouseY / scale;

      const shipX = Math.max(
        baseWidth * 0.6,
        Math.min(baseWidth * 0.9, mouseXBase),
      );
      const shipY = Math.max(
        baseHeight * 0.3,
        Math.min(baseHeight * 0.7, mouseYBase),
      );

      renderInfo.ctx.translate(shipX, shipY);
      renderInfo.ctx.scale(3, 3);

      renderInfo.atlasManager.drawTexture(
        "entities",
        clientManager.state.selectedShip.sprite,
        renderInfo.ctx,
        -16,
        -16,
      );

      renderInfo.ctx.restore();

      // Draw click instruction
      renderInfo.ctx.fillStyle = "#888888";
      renderInfo.ctx.font = "14px Arial";
      renderInfo.ctx.textAlign = "center";
      renderInfo.ctx.fillText(
        "Click on ship to change",
        baseWidth * 0.75,
        baseHeight * 0.8,
      );
    } else {
      console.log("Atlas not loaded, drawing fallback");
      // Draw fallback rectangle
      renderInfo.ctx.fillStyle = "#ff0000";
      renderInfo.ctx.fillRect(
        baseWidth * 0.75 - 25,
        baseHeight * 0.5 - 25,
        50,
        50,
      );
    }
  }
  public onMouseMove(event: MouseEvent, canvasXY: [number, number]): void {
    this.mouseX = canvasXY[0];
    this.mouseY = canvasXY[1];
  }
  public onClick(event: PointerEvent, canvasXY: [number, number]): void {
    // Convert click coordinates to base resolution
    const scale = this.renderInfo.canvas.width / 1280;
    const clickXBase = canvasXY[0] / scale;
    const clickYBase = canvasXY[1] / scale;

    const baseWidth = 1280;
    const baseHeight = 720;

    // Check if clicked on ship (right side of screen)
    const shipArea = {
      x: baseWidth * 0.6,
      y: baseHeight * 0.3,
      width: baseWidth * 0.3,
      height: baseHeight * 0.4,
    };

    if (
      clickXBase >= shipArea.x &&
      clickXBase <= shipArea.x + shipArea.width &&
      clickYBase >= shipArea.y &&
      clickYBase <= shipArea.y + shipArea.height
    ) {
      clientManager.setScreen(ShipSelectionScreen);
    }

    // Check if clicked on "Start Game" button
    const startButton = {
      x: baseWidth * 0.1,
      y: baseHeight * 0.7,
      width: 200,
      height: 60,
    };

    if (
      clickXBase >= startButton.x &&
      clickXBase <= startButton.x + startButton.width &&
      clickYBase >= startButton.y &&
      clickYBase <= startButton.y + startButton.height
    ) {
      clientManager.setScreen(InGameScreen);
      (clientManager.currentScreen as InGameScreen).initGame();
    }
  }
}
