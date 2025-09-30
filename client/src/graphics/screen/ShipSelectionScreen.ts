import type { MouseInfo, RenderInfo } from "../../ClientManager";
import { clientManager } from "../../Main";
import { MainMenuScreen } from "./MainMenuScreen";
import { ClientScreen } from "./Screen";
import { ships } from "../../assets/textures/skins/players.json";
import type { Ship } from "../../../../core/src/types";

export class ShipSelectionScreen extends ClientScreen {
  constructor(renderInfo: RenderInfo) {
    super(renderInfo);
    clientManager.state.ships = ships as Ship[];
  }
  public render(renderInfo: RenderInfo): void {
    const baseWidth = 1280;
    const baseHeight = 720;

    // Draw background
    renderInfo.ctx.fillStyle = "#1a1a1a";
    renderInfo.ctx.fillRect(0, 0, baseWidth, baseHeight);

    // Draw title
    renderInfo.ctx.fillStyle = "#ffffff";
    renderInfo.ctx.font = "32px Arial";
    renderInfo.ctx.textAlign = "center";
    renderInfo.ctx.fillText("SELECT SHIP", baseWidth / 2, 100);

    // Draw back button
    renderInfo.ctx.fillStyle = "#333333";
    renderInfo.ctx.fillRect(50, 50, 100, 40);
    renderInfo.ctx.fillStyle = "#ffffff";
    renderInfo.ctx.font = "16px Arial";
    renderInfo.ctx.textAlign = "center";
    renderInfo.ctx.fillText("BACK", 100, 75);

    // Draw ship list
    const shipItemHeight = 80;
    const startY = 150;

    for (let i = 0; i < renderInfo.state.ships.length; i++) {
      const ship = renderInfo.state.ships[i];
      const itemY = startY + i * shipItemHeight;

      // Highlight selected ship
      if (ship.id === renderInfo.state.selectedShip.id) {
        renderInfo.ctx.fillStyle = "#444444";
        renderInfo.ctx.fillRect(50, itemY, baseWidth - 100, shipItemHeight);
      }

      // Draw ship sprite
      if (renderInfo.atlasManager.areAllLoaded()) {
        renderInfo.ctx.save();
        renderInfo.ctx.translate(100, itemY + 40);
        renderInfo.ctx.scale(2, 2);

        renderInfo.atlasManager.drawTexture(
          "entities",
          ship.sprite,
          renderInfo.ctx,
          -16,
          -16,
        );

        renderInfo.ctx.restore();
      }

      // Draw ship info
      renderInfo.ctx.fillStyle = "#ffffff";
      renderInfo.ctx.font = "20px Arial";
      renderInfo.ctx.textAlign = "left";
      renderInfo.ctx.fillText(ship.name, 150, itemY + 25);

      renderInfo.ctx.font = "14px Arial";
      renderInfo.ctx.fillStyle = "#cccccc";
      renderInfo.ctx.fillText(ship.description, 150, itemY + 50);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onMouseMove(_info: MouseInfo): void {}
  public onClick(info: MouseInfo): void {
    const shipItemHeight = 80;
    const startY = 150;

    // Check if clicked on a ship
    for (let i = 0; i < this.renderInfo.state.ships.length; i++) {
      const itemY = startY + i * shipItemHeight;
      if (info.base.y >= itemY && info.base.y <= itemY + shipItemHeight) {
        clientManager.state.selectedShip = this.renderInfo.state.ships[i];
        clientManager.setScreen(MainMenuScreen);
        return;
      }
    }

    // Check if clicked on "Back" button
    const backButton = {
      x: 50,
      y: 50,
      width: 100,
      height: 40,
    };

    if (
      info.base.x >= backButton.x &&
      info.base.x <= backButton.x + backButton.width &&
      info.base.y >= backButton.y &&
      info.base.y <= backButton.y + backButton.height
    ) {
      clientManager.setScreen(MainMenuScreen);
    }
  }
}
