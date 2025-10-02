import type { RenderInfo, MouseInfo } from "../../ClientManager";
import { clientManager } from "../../Main";
import { ButtonComponent } from "../component/ButtonComponent";
import { InputComponent } from "../component/InputComponent";
import { MainMenuScreen } from "./MainMenuScreen";
import { ClientScreen } from "./Screen";

export class LoginScreen extends ClientScreen {
  // Use base resolution for positioning (1280x720)
  private readonly baseWidth = 1280;
  private readonly baseHeight = 720;
  public render(renderInfo: RenderInfo): void {}
  public onMouseMove(info: MouseInfo): void {}
  public onClick(info: MouseInfo): void {}
  public init(): void {
    this.components = [
      new ButtonComponent({
        x: 50,
        y: 50,
        data: {
          width: 100,
          height: 40,
          text: "BACK",
          onclick: () => {
            clientManager.setScreen(MainMenuScreen);
          },
          textProperties: {
            font: "16px Arial",
          },
        },
      }),
      new InputComponent({
        x: this.baseWidth * 0.5,
        y: this.baseHeight * 0.5,
        data: {
          width: 150,
          height: 50,
          selected: true,
          placeholder: "username",
        },
      }),
    ];
  }
}
