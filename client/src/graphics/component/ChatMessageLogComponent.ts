import type { MouseInfo, RenderInfo } from "../../ClientManager";
import { clientManager } from "../../Main";
import type { ChatMessageEntry } from "../screen/InGameScreen";
import { Component } from "./Component";
import { InputComponent } from "./InputComponent";

type ChatMessageLogComponentData = {
  font?: string;
  fillStyle?: string | CanvasGradient | CanvasPattern;
  visible: boolean;
};

export class ChatMessageLogComponent extends Component<ChatMessageLogComponentData> {
  public messages: ChatMessageEntry[] = [];
  public input = new InputComponent({
    x: this.args.x,
    y: this.args.y - 20,
    data: {
      width: 200,
      height: 16,
      selected: false,
      placeholder: "<command>",
      font: "16px Arial",
      onEnter: (component) => {
        const command = component.text;
        component.text = "";
        clientManager.webSocketManager.sendCommand({ command: command });
      },
    },
  });
  public render(renderInfo: RenderInfo): void {
    if (!this.args.data.visible) return;
    this.input.render(renderInfo);
    renderInfo.ctx.font =
      this.args.data.font === undefined ? "16px Arial" : this.args.data.font;
    let currentPos =
      this.args.y - this.input.args.data.height - parseInt(renderInfo.ctx.font);
    renderInfo.ctx.fillStyle =
      this.args.data.fillStyle === undefined
        ? "yellow"
        : this.args.data.fillStyle;
    renderInfo.ctx.textAlign = "left";
    renderInfo.ctx.textBaseline = "middle";
    const textHeight = parseInt(renderInfo.ctx.font);
    for (const message of this.messages.sort(
      (a, b) => b.created_at - a.created_at,
    )) {
      renderInfo.ctx.fillText(
        (message.sender === undefined ? "<server>" : message.sender) +
          (message.sender === "" ? "" : " ") +
          message.message,
        this.args.x,
        currentPos,
      );
      currentPos -= textHeight;
    }
  }

  public override onClick(info: MouseInfo): void {
    this.input.onClick(info);
  }
  public override onMouseMove(info: MouseInfo): void {
    this.input.onMouseMove(info);
  }
  public override onKeyDown(event: KeyboardEvent): void {
    this.input.onKeyDown(event);
  }
}
