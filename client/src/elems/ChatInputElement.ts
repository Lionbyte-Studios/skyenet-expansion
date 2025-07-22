import { CanvasElement } from "./CanvasElement";

export class ChatInputElement extends CanvasElement {
  private placeholder: string;
  public borderStyle: string = "green";
  public activeBorderStyle: string = "white";
  public placeHolderStyle: string = "dark-gray";
  public placeHolderFont: string = "20px serif";
  override width: number;
  override height: number;
  private autoDetectSelection: boolean;
  public active: boolean = false;

  constructor(
    ctx: CanvasRenderingContext2D,
    placeholder: string,
    x: number,
    y: number,
    width: number,
    height: number,
    autoDetectSelection?: boolean,
  ) {
    super(ctx, x, y, width, height);
    this.width = width;
    this.height = height;
    this.placeholder = placeholder;
    if (autoDetectSelection === undefined || autoDetectSelection === true)
      this.autoDetectSelection = true;
    else this.autoDetectSelection = false;

    this.registerEventListeners();
  }

  public override render() {
    this.ctx.strokeStyle = this.active
      ? this.activeBorderStyle
      : this.borderStyle;
    this.ctx.strokeRect(this.x, this.y, this.width, this.height);
    this.ctx.fillStyle = this.placeHolderStyle;
    this.ctx.font = this.placeHolderFont;
    this.ctx.fillText(this.placeholder, this.x, this.y, this.width);
  }

  private registerEventListeners() {
    const isInThisElem = (x: number, y: number) => {
      if (x < this.x || y < this.y) return false;
      if (x > this.x + this.width || y > this.y + this.height) return false;
      return true;
    };
    if (this.autoDetectSelection) {
      this.ctx.canvas.addEventListener("click", (event) => {
        const rect = this.ctx.canvas.getBoundingClientRect();
        const mouseRelativeCoords = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
        console.log(
          `Click at ${mouseRelativeCoords.x} ${mouseRelativeCoords.y}`,
        );
        if (this.active) {
          if (isInThisElem(mouseRelativeCoords.x, mouseRelativeCoords.y))
            return;
          this.active = false;
          return;
        }
        if (!isInThisElem(mouseRelativeCoords.x, mouseRelativeCoords.y)) return;
        this.active = true;
      });
    }
  }
}
