import type { RenderInfo } from "../../ClientManager";
import type { DeepRequired } from "../../lib/Util";
import { Component, type ComponentRenderArgs } from "./Component";

type BaseTextBoxComponentData = { text: string; width: number };

type TextBoxComponentData = {
  [key: string]: unknown;
} & BaseTextBoxComponentData & {
    height?: number;
    textColor?: string | CanvasGradient | CanvasPattern;
    backgroundColor?: string | CanvasGradient | CanvasPattern;
    wrap?: boolean;
    font?: string;
  };

export class TextBoxComponent extends Component<TextBoxComponentData> {
  declare public args: DeepRequired<ComponentRenderArgs<TextBoxComponentData>>;
  constructor(args: ComponentRenderArgs<TextBoxComponentData>) {
    super(args);
    const defaults: Required<
      Omit<TextBoxComponentData, keyof BaseTextBoxComponentData>
    > = {
      textColor: "#ffffff",
      backgroundColor: "#303030ff",
      wrap: true,
      font: "16px Arial",
      height: -1,
    };
    for (const key in defaults) {
      if (!(key in this.args.data)) {
        this.args.data[key] = defaults[key];
      }
    }
  }
  public render(renderInfo: RenderInfo): void {
    renderInfo.ctx.font = this.args.data.font;
    const texts = this.splitText(
      this.args.data.text,
      renderInfo.ctx,
      this.args.data.width - 10,
    );
    // const metrics = renderInfo.ctx.measureText(this.args.data.text);
    const textHeight = parseInt(renderInfo.ctx.font) * 1.1; // metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    const boxHeight =
      this.args.data.height === -1
        ? textHeight * texts.length
        : this.args.data.height;
    renderInfo.ctx.fillStyle = this.args.data.backgroundColor;
    renderInfo.ctx.fillRect(
      this.args.x,
      this.args.y,
      this.args.data.width,
      boxHeight + 5,
    );
    renderInfo.ctx.fillStyle = this.args.data.textColor;
    renderInfo.ctx.textAlign = "center";
    renderInfo.ctx.textBaseline = "middle";
    for (let i = 0; i < texts.length; i++) {
      renderInfo.ctx.fillText(
        texts[i],
        this.args.x + this.args.data.width / 2,
        5 +
          this.args.y +
          (boxHeight / texts.length) * (i + 1) -
          boxHeight / texts.length / 2,
      );
    }
  }
  private splitText(
    text: string,
    ctx: CanvasRenderingContext2D,
    maxWidth: number,
  ): string[] {
    const arr: string[] = [];
    let currentText = "";
    for (const c of text) {
      if (ctx.measureText(currentText + c).width <= maxWidth && c !== "\n")
        currentText += c;
      else {
        arr.push(currentText);
        currentText = c == "\n" ? "" : c;
      }
    }
    if (currentText.length !== 0) arr.push(currentText);
    return arr;
  }
}
