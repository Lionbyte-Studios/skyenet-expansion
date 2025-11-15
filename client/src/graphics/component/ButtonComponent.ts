import type { MouseInfo, RenderInfo } from "../../ClientManager";
import { isInArea } from "../../../../core/src/util/Util";
import { Component, type ComponentRenderArgs } from "./Component";

type TextProperties = {
  font?: string;
  align?: CanvasTextAlign;
  fillStyle?: string | CanvasGradient | CanvasPattern;
  baseline?: CanvasTextBaseline;
};
type BaseButtonComponentData = {
  width: number;
  height: number;
  onclick: () => void;
};
type ButtonComponentData =
  | (BaseButtonComponentData & {
      text: string;
      textProperties?: TextProperties;
      hidden?: false;
      fillStyle?: string | CanvasGradient | CanvasPattern;
      hoverFillStyle?: string | CanvasGradient | CanvasPattern;
    })
  | (BaseButtonComponentData & { hidden: true });

export class ButtonComponent extends Component<ButtonComponentData> {
  private hovered: boolean = false;
  public textProperties: Required<TextProperties>;
  public fillStyle: string | CanvasGradient | CanvasPattern;
  public hoverFillStyle: string | CanvasGradient | CanvasPattern;

  constructor(args: ComponentRenderArgs<ButtonComponentData>) {
    super(args);
    if ("hidden" in args.data && args.data.hidden === true) {
      this.textProperties = {
        font: "24px Arial",
        align: "center",
        fillStyle: "#ffffff",
        baseline: "middle",
      };
      this.fillStyle = "#00000000";
      this.hoverFillStyle = "#00000000";
    } else {
      args.data.textProperties ??= {};
      const font = args.data.textProperties.font ?? "24px Arial";
      const align = args.data.textProperties.align ?? "center";
      const fillStyle = args.data.textProperties.fillStyle ?? "#ffffff";
      const baseline = args.data.textProperties.baseline ?? "middle";
      this.textProperties = {
        font: font,
        align: align,
        fillStyle: fillStyle,
        baseline: baseline,
      };
      this.fillStyle = args.data.fillStyle ?? "#333333";
      this.hoverFillStyle = args.data.hoverFillStyle ?? "#535353";
    }
  }

  public render(renderInfo: RenderInfo): void {
    // dont render anything if hidden is true
    if ("hidden" in this.args.data && this.args.data.hidden === true) return;
    renderInfo.ctx.save();
    renderInfo.ctx.scale(1, 1);
    renderInfo.ctx.translate(0, 0);
    if (this.hovered) {
      renderInfo.ctx.fillStyle = this.hoverFillStyle;
    } else {
      renderInfo.ctx.fillStyle = this.fillStyle;
    }
    renderInfo.ctx.fillRect(
      this.args.x,
      this.args.y,
      this.args.data.width,
      this.args.data.height,
    );
    renderInfo.ctx.fillStyle = this.textProperties.fillStyle;
    renderInfo.ctx.font = this.textProperties.font;
    renderInfo.ctx.textAlign = this.textProperties.align;
    renderInfo.ctx.textBaseline = this.textProperties.baseline;
    renderInfo.ctx.fillText(
      this.args.data.text,
      this.args.x + this.args.data.width * 0.5,
      this.args.y + this.args.data.height * 0.5,
      this.args.data.width,
    );
    renderInfo.ctx.restore();
  }
  public onMouseMove(info: MouseInfo): void {
    this.hovered = isInArea(
      {
        x: this.args.x,
        y: this.args.y,
        width: this.args.data.width,
        height: this.args.data.height,
      },
      { x: info.base.x, y: info.base.y },
    );
  }
  public onClick(info: MouseInfo): void {
    if (
      !isInArea(
        {
          x: this.args.x,
          y: this.args.y,
          width: this.args.data.width,
          height: this.args.data.height,
        },
        { x: info.base.x, y: info.base.y },
      )
    )
      return;
    this.args.data.onclick();
  }
}
