import type { RenderInfo, MouseInfo } from "../../ClientManager";
import { clientManager } from "../../Main";
import { login } from "../../net/api/Api";
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
        y: this.baseHeight * 0.35,
        data: {
          width: 150,
          height: 50,
          selected: true,
          placeholder: "username",
        },
        custom_id: "username",
      }),
      new InputComponent({
        x: this.baseWidth * 0.5,
        y: this.baseHeight * 0.45,
        data: {
          width: 150,
          height: 50,
          selected: false,
          placeholder: "password",
          type: "password",
        },
        custom_id: "password",
      }),
      new ButtonComponent({
        x: this.baseWidth * 0.5,
        y: this.baseHeight * 0.55,
        data: {
          text: "Login",
          width: 150,
          height: 50,
          onclick: async () => {
            this.setComponentData<ButtonComponent>(
              (c) => c.args.custom_id === "login_button",
              { data: { text: "Logging in..." } },
            );
            const username =
              this.getComponentByID<InputComponent>("username")!.text;
            const password =
              this.getComponentByID<InputComponent>("password")!.text;
            const res = await login(username, password);
            if (res.error !== undefined) {
              alert(`Failed to log in (error ${res.error})`);
              return;
            } else {
              clientManager.clientStorage.set(
                "session",
                JSON.stringify({
                  token: res.session.token,
                  user_id: res.session.user_id,
                }),
              );
              clientManager.setScreen(MainMenuScreen);
            }
            // console.log("username: " + this.getComponentByID<InputComponent>("username")?.text + "\npassword: " + this.getComponentByID<InputComponent>("password")?.text);
          },
        },
        custom_id: "login_button",
      }),
    ];
  }
}
