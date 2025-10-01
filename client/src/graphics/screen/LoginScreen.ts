import type { RenderInfo, MouseInfo } from "../../ClientManager";
import { InputComponent } from "../component/InputComponent";
import { ClientScreen } from "./Screen";

export class LoginScreen extends ClientScreen {
  public render(renderInfo: RenderInfo): void {}
  public onMouseMove(info: MouseInfo): void {}
  public onClick(info: MouseInfo): void {}
  public init(): void {
    this.components = [
      /*new ButtonComponent({
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
            }),*/
      new InputComponent({
        x: 50,
        y: 50,
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
