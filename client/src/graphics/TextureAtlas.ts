export interface TextureRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class TextureAtlas {
  private image: HTMLImageElement;
  private regions: Map<string, TextureRegion>;
  private loaded: boolean = false;
  private tileSize: number;

  constructor(
    imagePath: string,
    atlasData: Record<string, TextureRegion>,
    tileSize: number = 32,
  ) {
    this.image = new Image();
    this.regions = new Map(Object.entries(atlasData));
    this.tileSize = tileSize;

    this.image.onload = () => {
      this.loaded = true;
    };
    this.image.src = imagePath;
  }

  // Static method to create atlas from JSON file
  public static async fromJSON(
    imagePath: string,
    jsonPath: string,
  ): Promise<TextureAtlas> {
    const response = await fetch(jsonPath);
    const atlasData = await response.json();
    return new TextureAtlas(imagePath, atlasData);
  }

  // Static method to create grid-based atlas
  public static createGridAtlas(
    imagePath: string,
    tileSize: number = 32,
  ): TextureAtlas {
    return new TextureAtlas(imagePath, {}, tileSize);
  }

  public drawTexture(
    ctx: CanvasRenderingContext2D,
    textureName: string,
    dx: number,
    dy: number,
    dWidth?: number,
    dHeight?: number,
  ): void {
    if (!this.loaded) return;

    const region = this.regions.get(textureName);
    if (!region) {
      console.warn(`Texture "${textureName}" not found in atlas`);
      return;
    }

    if (dWidth !== undefined && dHeight !== undefined) {
      ctx.drawImage(
        this.image,
        region.x,
        region.y,
        region.width,
        region.height,
        dx,
        dy,
        dWidth,
        dHeight,
      );
    } else {
      ctx.drawImage(
        this.image,
        region.x,
        region.y,
        region.width,
        region.height,
        dx,
        dy,
        region.width,
        region.height,
      );
    }
  }

  public drawTextureCentered(
    ctx: CanvasRenderingContext2D,
    textureName: string,
    dx: number,
    dy: number,
    dWidth?: number,
    dHeight?: number,
  ): void {
    if (!this.loaded) return;

    const region = this.regions.get(textureName);
    if (!region) {
      console.warn(`Texture "${textureName}" not found in atlas`);
      return;
    }

    if (dWidth !== undefined && dHeight !== undefined) {
      ctx.drawImage(
        this.image,
        region.x,
        region.y,
        region.width,
        region.height,
        dx - dWidth / 2,
        dy - dHeight / 2,
        dWidth,
        dHeight,
      );
    } else {
      ctx.drawImage(
        this.image,
        region.x,
        region.y,
        region.width,
        region.height,
        dx - region.width / 2,
        dy - region.height / 2,
        region.width,
        region.height,
      );
    }
  }

  // Draw texture by grid coordinates (1-indexed)
  public drawTileByGrid(
    ctx: CanvasRenderingContext2D,
    gridX: number,
    gridY: number,
    dx: number,
    dy: number,
    dWidth?: number,
    dHeight?: number,
  ): void {
    if (!this.loaded) return;

    // Convert grid coordinates to pixel coordinates (1-indexed to 0-indexed)
    const sourceX = (gridX - 1) * this.tileSize;
    const sourceY = (gridY - 1) * this.tileSize;

    const drawWidth = dWidth || this.tileSize;
    const drawHeight = dHeight || this.tileSize;

    ctx.drawImage(
      this.image,
      sourceX,
      sourceY,
      this.tileSize,
      this.tileSize,
      dx,
      dy,
      drawWidth,
      drawHeight,
    );
  }

  // Add a named texture at specific grid coordinates
  public addGridTexture(name: string, gridX: number, gridY: number): void {
    const region: TextureRegion = {
      x: (gridX - 1) * this.tileSize,
      y: (gridY - 1) * this.tileSize,
      width: this.tileSize,
      height: this.tileSize,
    };
    this.regions.set(name, region);
  }

  public isLoaded(): boolean {
    return this.loaded;
  }

  public getRegion(textureName: string): TextureRegion | undefined {
    return this.regions.get(textureName);
  }

  public hasTexture(textureName: string): boolean {
    return this.regions.has(textureName);
  }

  public getTextureNames(): string[] {
    return Array.from(this.regions.keys());
  }

  public getTileSize(): number {
    return this.tileSize;
  }
}
