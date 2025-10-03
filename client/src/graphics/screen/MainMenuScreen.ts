import type { MouseInfo, RenderInfo } from "../../ClientManager";
import { nullMouseInfo } from "../../lib/Util";
import { clientManager } from "../../Main";
import { ButtonComponent } from "../component/ButtonComponent";
import { TextComponent } from "../component/TextComponent";
import { UserPfpComponent } from "../component/UserPfpComponent";
import { InGameScreen } from "./InGameScreen";
import { ClientScreen } from "./Screen";
import { ShipSelectionScreen } from "./ShipSelectionScreen";

export class MainMenuScreen extends ClientScreen {
  private mouseInfo: MouseInfo = nullMouseInfo();
  // Use base resolution for positioning (1280x720)
  private readonly baseWidth = 1280;
  private readonly baseHeight = 720;

  public render(renderInfo: RenderInfo): void {
    // Draw title
    renderInfo.ctx.fillStyle = "#ffffff";
    renderInfo.ctx.font = "48px Arial";
    renderInfo.ctx.textAlign = "center";
    renderInfo.ctx.fillText("SPACENET", this.baseWidth / 2, 100);

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
  public override onMouseMove(info: MouseInfo): void {
    this.mouseInfo = info;
  }

  public override init(): void {
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
      new TextComponent({
        x: this.baseWidth * 0.75,
        y: this.baseHeight * 0.8,
        data: {
          text: "Click on ship to change",
          textProperties: {
            fillStyle: "#888888",
            font: "14px Arial",
            align: "center",
          },
        },
      }),
      new TextComponent({
        x: this.baseWidth * 0.1,
        y: this.baseHeight * 0.3,
        data: {
          text: "Selected Ship:",
          textProperties: {
            font: "20px Arial",
            align: "left",
          },
        },
      }),
      new TextComponent({
        x: this.baseWidth * 0.1,
        y: this.baseHeight * 0.35,
        data: {
          text: clientManager.state.selectedShip.name,
          textProperties: {
            font: "16px Arial",
            align: "left",
          },
        },
        custom_id: "selected_ship_name",
      }),
      new TextComponent({
        x: this.baseWidth * 0.1,
        y: this.baseHeight * 0.4,
        data: {
          text: clientManager.state.selectedShip.description,
          textProperties: {
            font: "16px Arial",
            align: "left",
          },
        },
        custom_id: "selected_ship_description",
      }),
      /*new ButtonComponent({
        x: this.baseWidth * 0.9,
        y: this.baseHeight * 0.1,
        data: {
          width: 120,
          height: 60,
          text: "LOGIN",
          onclick: () => {
            clientManager.setScreen(LoginScreen);
          },
        },
      }),*/
    ];
    if (clientManager.loggedInUser !== undefined) {
      (async () => {
        const user = await clientManager.loggedInUser;
        if (user === undefined) return;
        this.components.push(
          new UserPfpComponent({
            x: this.baseWidth - this.baseWidth * 0.025 - this.baseWidth * 0.05,
            y: this.baseWidth * 0.025,
            data: {
              avatar: user.discord.avatar,
              user_id: user.discord.user_id,
              width: this.baseWidth * 0.05,
              height: this.baseWidth * 0.05,
            },
            custom_id: "user_pfp",
          }),
        );
        const index = this.getComponentIndexById("user_pfp");
        this.components[index!].init();
      })();
    }
  }
}
