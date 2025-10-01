import type { RenderInfo, MouseInfo } from "../../ClientManager";
import { Component, type ComponentRenderArgs } from "./Component";

type TextProperties = {
  font?: string;
  align?: CanvasTextAlign;
  fillStyle?: string | CanvasGradient | CanvasPattern;
  baseline?: CanvasTextBaseline;
  maxWidth?: number;
};

type TextComponentData = {
  text: string;
  hidden?: boolean;
  textProperties?: TextProperties;
};

export class TextComponent extends Component<TextComponentData> {
  public textProperties: Required<TextProperties>;

  constructor(args: ComponentRenderArgs<TextComponentData>) {
    super(args);

    const font =
      args.data.textProperties === undefined ||
      args.data.textProperties.font === undefined
        ? "24px Arial"
        : args.data.textProperties.font;
    const align =
      args.data.textProperties === undefined ||
      args.data.textProperties.align === undefined
        ? "center"
        : args.data.textProperties.align;
    const fillStyle =
      args.data.textProperties === undefined ||
      args.data.textProperties.fillStyle === undefined
        ? "#ffffff"
        : args.data.textProperties.fillStyle;
    const baseline =
      args.data.textProperties === undefined ||
      args.data.textProperties.baseline === undefined
        ? "middle"
        : args.data.textProperties.baseline;
    const maxWidth =
      args.data.textProperties === undefined ||
      args.data.textProperties.maxWidth === undefined
        ? -1
        : args.data.textProperties.maxWidth;
    this.textProperties = {
      font: font,
      align: align,
      fillStyle: fillStyle,
      baseline: baseline,
      maxWidth: maxWidth,
    };
  }

  public render(renderInfo: RenderInfo): void {
    // dont render if hidden is set to true
    if (this.args.data.hidden !== undefined && this.args.data.hidden === true)
      return;
    renderInfo.ctx.save();

    renderInfo.ctx.fillStyle = this.textProperties.fillStyle;
    renderInfo.ctx.font = this.textProperties.font;
    renderInfo.ctx.textAlign = this.textProperties.align;
    renderInfo.ctx.textBaseline = this.textProperties.baseline;
    renderInfo.ctx.fillText(
      this.args.data.text,
      this.args.x,
      this.args.y,
      this.textProperties.maxWidth === -1
        ? undefined
        : this.textProperties.maxWidth,
    );

    renderInfo.ctx.restore();
  }
  public onMouseMove(info: MouseInfo): void {}
  public onClick(info: MouseInfo): void {}
}
