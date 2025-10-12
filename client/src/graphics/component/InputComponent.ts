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
  textLengthLimit?: number;
  type?: "text" | "password";
  password_redacter?: string;
  onEnter?: (component: InputComponent) => void;
};

export class InputComponent extends Component<InputComponentData> {
  public text: string = "";
  public data: Required<InputComponentData>;
  constructor(args: ComponentRenderArgs<InputComponentData>) {
    super(args);
    const placeholder =
      args.data.placeholder === undefined ? "" : args.data.placeholder;
    const initialValue =
      args.data.initialValue === undefined ? "" : args.data.initialValue;
    const font = args.data.font === undefined ? "20px Arial" : args.data.font;
    const type = args.data.type === undefined ? "text" : args.data.type;
    const password_redacter =
      args.data.password_redacter === undefined
        ? "●"
        : args.data.password_redacter;
    const textLengthLimit =
      args.data.textLengthLimit === undefined
        ? 1024
        : args.data.textLengthLimit;
    const onEnter =
      args.data.onEnter === undefined ? () => {} : args.data.onEnter;
    this.data = {
      placeholder: placeholder,
      initialValue: initialValue,
      font: font,
      width: args.data.width,
      height: args.data.height,
      selected: args.data.selected,
      textLengthLimit: textLengthLimit,
      type: type,
      password_redacter: password_redacter,
      onEnter: onEnter,
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
    const textToRender = this.limitText(
      renderInfo.ctx,
      this.text.length === 0
        ? this.data.placeholder
        : this.data.type === "text"
          ? this.text
          : this.makePassword(this.text.length),
      this.data.width,
    );
    const colorToRender = this.text.length === 0 ? "#7a7a7a" : "#ffffff";
    renderInfo.ctx.fillStyle = colorToRender;
    renderInfo.ctx.fillText(
      textToRender,
      this.args.x + this.data.width * 0.5,
      this.args.y + this.data.height * 0.5,
    );

    if (this.data.selected) {
      renderInfo.ctx.strokeStyle = "#7c7c7cff";
      renderInfo.ctx.strokeRect(
        this.args.x,
        this.args.y,
        this.data.width,
        this.data.height,
      );
      const timestamp = Date.now() % 1000;
      if (timestamp < 500) {
        renderInfo.ctx.fillStyle = "#c9c9c9ff";
        const offset =
          this.text.length === 0
            ? 0
            : renderInfo.ctx.measureText(textToRender).width * 0.5;
        renderInfo.ctx.fillRect(
          this.args.x + this.data.width * 0.5 + offset,
          this.args.y + this.data.height * 0.1,
          3,
          this.data.height * 0.8,
        );
      }
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
    event.stopPropagation();
    if (event.key.length === 1) {
      if (this.text.length >= this.data.textLengthLimit) return;
      this.text += event.key;
    } else if (event.key === "Backspace") {
      this.text = this.text.slice(0, -1);
    } else if (event.key === "Enter") {
      this.data.onEnter(this);
    }
  }

  private limitText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
  ) {
    let newText = text;
    while (ctx.measureText(newText).width > maxWidth && newText.length !== 0) {
      newText = newText.slice(1);
    }
    return newText;
  }

  private makePassword(len: number) {
    return this.data.password_redacter.repeat(len);
  }
}
