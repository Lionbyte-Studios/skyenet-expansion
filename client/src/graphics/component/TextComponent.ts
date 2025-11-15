import type { RenderInfo } from "../../ClientManager";
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

    args.data.textProperties ??= {};
    const font = args.data.textProperties.font ?? "24px Arial";
    const align = args.data.textProperties.align ?? "center";
    const fillStyle = args.data.textProperties.fillStyle ?? "#ffffff";
    const baseline = args.data.textProperties.baseline ?? "middle";
    const maxWidth = args.data.textProperties.maxWidth ?? -1;
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
}
