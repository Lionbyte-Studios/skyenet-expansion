import type { RenderInfo, MouseInfo } from "../../ClientManager";
import { isInArea } from "../../lib/Util";
import { clientManager } from "../../Main";
import { Component, type ComponentRenderArgs } from "./Component";

type InputComponentData = {
  width: number;
  height: number;
  font?: string;
  placeholder?: string;
  initialValue?: string;
  selected: boolean;
};

export class InputComponent extends Component<InputComponentData> {
  private text: string = "";
  private data: Required<InputComponentData>;
  constructor(args: ComponentRenderArgs<InputComponentData>) {
    super(args);
    const placeholder =
      args.data.placeholder === undefined ? "" : args.data.placeholder;
    const initialValue =
      args.data.initialValue === undefined ? "" : args.data.initialValue;
    const font = args.data.font === undefined ? "20px Arial" : args.data.font;
    this.data = {
      placeholder: placeholder,
      initialValue: initialValue,
      font: font,
      width: args.data.width,
      height: args.data.height,
      selected: args.data.selected,
    };
  }
  public render(renderInfo: RenderInfo): void {
    renderInfo.ctx.save();
    renderInfo.ctx.fillStyle = "#333333";
    renderInfo.ctx.fillRect(
      this.args.x,
      this.args.y,
      this.data.width,
      this.data.height,
    );
    renderInfo.ctx.font = this.data.font;
    renderInfo.ctx.textAlign = "center";
    renderInfo.ctx.textBaseline = "middle";
    if (this.text.length === 0) {
      renderInfo.ctx.fillStyle = "#7a7a7a";
      renderInfo.ctx.fillText(
        this.data.placeholder,
        this.args.x + this.data.width * 0.5,
        this.args.y + this.data.height * 0.5,
        this.data.width,
      );
    } else {
      renderInfo.ctx.fillStyle = "#ffffff";
      renderInfo.ctx.fillText(
        this.text,
        this.args.x + this.data.width * 0.5,
        this.args.y + this.data.height * 0.5,
        this.data.width,
      );
    }
    renderInfo.ctx.restore();
  }
  public onMouseMove(info: MouseInfo): void {
    if (
      isInArea(
        {
          x: this.args.x,
          y: this.args.y,
          width: this.data.width,
          height: this.data.height,
        },
        { x: info.base.x, y: info.base.y },
      )
    ) {
      clientManager.cursor = "text";
    }
  }
  public onClick(info: MouseInfo): void {
    this.data.selected = isInArea(
      {
        x: this.args.x,
        y: this.args.y,
        width: this.data.width,
        height: this.data.height,
      },
      { x: info.base.x, y: info.base.y },
    );
    console.log("click: " + this.data.selected);
  }
  public override onKeyDown(event: KeyboardEvent): void {
    if (!this.data.selected) return;
    console.log("key: " + event.key);
    if (event.key.length === 1) {
      this.text += event.key;
    } else if (event.key === "Backspace") {
      this.text = this.text.slice(0, -1);
    }
  }
}
