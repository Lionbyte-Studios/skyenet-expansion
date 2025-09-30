import type { MouseInfo, RenderInfo } from "../../ClientManager";
import { nullMouseInfo } from "../../lib/Util";
import { clientManager } from "../../Main";
import { ButtonComponent } from "../component/ButtonComponent";
import { InGameScreen } from "./InGameScreen";
import { ClientScreen } from "./Screen";
import { ShipSelectionScreen } from "./ShipSelectionScreen";

export class MainMenuScreen extends ClientScreen {
  private mouseInfo: MouseInfo = nullMouseInfo();
  // Use base resolution for positioning (1280x720)
  private readonly baseWidth = 1280;
  private readonly baseHeight = 720;

  constructor(renderInfo: RenderInfo) {
    super(renderInfo);
    this.components = [
      new ButtonComponent({
        x: this.baseWidth * 0.1,
        y: this.baseHeight * 0.7,
        data: {
          width: 200,
          height: 60,
          text: "START GAME",
          onclick: () => {
            clientManager.setScreen(InGameScreen);
            (clientManager.currentScreen as InGameScreen).initGame();
          },
        },
      }),
      new ButtonComponent({
        x: this.baseWidth * 0.6,
        y: this.baseHeight * 0.3,
        data: {
          width: this.baseWidth * 0.3,
          height: this.baseHeight * 0.4,
          hidden: true,
          onclick: () => {
            clientManager.setScreen(ShipSelectionScreen);
          },
        },
      }),
    ];
  }

  public render(renderInfo: RenderInfo): void {
    // Draw title
    renderInfo.ctx.fillStyle = "#ffffff";
    renderInfo.ctx.font = "48px Arial";
    renderInfo.ctx.textAlign = "center";
    renderInfo.ctx.fillText("SPACENET", this.baseWidth / 2, 100);

    // Draw menu items on the left
    renderInfo.ctx.font = "24px Arial";
    renderInfo.ctx.textAlign = "left";

    // Ship selection info
    renderInfo.ctx.font = "20px Arial";
    renderInfo.ctx.fillText(
      "Selected Ship:",
      this.baseWidth * 0.1,
      this.baseHeight * 0.3,
    );
    renderInfo.ctx.font = "16px Arial";
    renderInfo.ctx.fillText(
      clientManager.state.selectedShip.name,
      this.baseWidth * 0.1,
      this.baseHeight * 0.35,
    );
    renderInfo.ctx.fillText(
      clientManager.state.selectedShip.description,
      this.baseWidth * 0.1,
      this.baseHeight * 0.4,
    );

    // Draw ship that follows mouse (right side)
    if (renderInfo.atlasManager.areAllLoaded()) {
      // console.log("Atlas is loaded, drawing normal thing");
      renderInfo.ctx.save();

      // Calculate ship position to follow mouse but stay on right side
      const mouseXBase = this.mouseInfo.base.x;
      const mouseYBase = this.mouseInfo.base.y;

      const shipX = Math.max(
        this.baseWidth * 0.6,
        Math.min(this.baseWidth * 0.9, mouseXBase),
      );
      const shipY = Math.max(
        this.baseHeight * 0.3,
        Math.min(this.baseHeight * 0.7, mouseYBase),
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
        this.baseWidth * 0.75,
        this.baseHeight * 0.8,
      );
    } else {
      console.log("Atlas not loaded, drawing fallback");
      // Draw fallback rectangle
      renderInfo.ctx.fillStyle = "#ff0000";
      renderInfo.ctx.fillRect(
        this.baseWidth * 0.75 - 25,
        this.baseHeight * 0.5 - 25,
        50,
        50,
      );
    }
  }
  public onMouseMove(info: MouseInfo): void {
    this.mouseInfo = info;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onClick(_info: MouseInfo): void {}
}
