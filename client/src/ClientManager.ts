import { ShipEngineSprite, ShipSprite, type Ship } from "../../core/src/types";
import type { ClientGame } from "./ClientGame";
import { AtlasManager } from "./graphics/AtlasManager";
import { MainMenuScreen } from "./graphics/screen/MainMenuScreen";
import { ClientScreen } from "./graphics/screen/Screen";
import { ClientStorage } from "./lib/settings/ClientStorage";
import { WebSocketClient } from "./net/WebSocketClient";

export interface RenderInfo {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  game: ClientGame | undefined;
  atlasManager: AtlasManager;
  state: ClientState;
  display: DisplayInfo;
}

interface DisplayInfo {
  startWidth: number;
  aspectRatio: [number, number];
  scale: number;
}

interface ClientState {
  selectedShip: Ship;
  ships: Ship[];
}

export interface MouseInfo {
  real: {
    x: number;
    y: number;
  };
  canvas: {
    x: number;
    y: number;
  };
  base: {
    x: number;
    y: number;
  };
}

export class ClientManager {
  public game!: ClientGame;
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public display: DisplayInfo;
  public currentScreen: ClientScreen;
  public state: ClientState;
  public webSocketManager: WebSocketClient;
  public clientStorage: ClientStorage;
  public atlasManager: AtlasManager;

  constructor(atlasManager: AtlasManager) {
    document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
          <div>
          </div>
        `;

    // Disable right click
    document.addEventListener("contextmenu", (event) => event.preventDefault());

    this.canvas = document.getElementById("screen") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.display = { startWidth: 1280, aspectRatio: [16, 9], scale: 0 };
    this.currentScreen = new MainMenuScreen(this.getRenderInfo());

    this.canvas.addEventListener("click", (event) => {
      this.onClick(event);
    });
    this.canvas.addEventListener("mousemove", (event) => {
      this.onMouseMove(event);
    });
    this.state = {
      selectedShip: {
        id: "gray-ship",
        name: "Gray Fighter",
        description: "A reliable starter ship with balanced stats",
        sprite: ShipSprite.Gray,
        engineSprite: ShipEngineSprite.Gray,
      },
      ships: [],
    };
    this.webSocketManager = new WebSocketClient("ws://localhost:8081");
    this.clientStorage = new ClientStorage();
    this.atlasManager = atlasManager;
  }

  public isGameRunning() {
    return this.game !== undefined;
  }

  public startTick() {
    requestAnimationFrame(this.tick.bind(this));
  }

  public tick() {
    requestAnimationFrame(this.tick.bind(this));
    this.canvas.width = window.innerWidth;
    this.canvas.height = (9 * window.innerWidth) / 16; // 16:9 aspect ratio

    if (this.canvas.height > window.innerHeight) {
      this.canvas.height = window.innerHeight;
      this.canvas.width = (16 * window.innerHeight) / 9;
    }

    // Scale the canvas context
    const scale = this.canvas.width / 1280;
    this.ctx.scale(scale, scale);

    this.currentScreen.render(this.getRenderInfo());
    this.currentScreen.components.forEach((component) =>
      component.render(this.getRenderInfo()),
    );
  }

  private onClick(event: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    // Convert click coordinates to base resolution
    const scale = this.canvas.width / 1280;
    const clickXBase = mouseX / scale;
    const clickYBase = mouseY / scale;
    this.currentScreen.onClick({
      real: { x: event.clientX, y: event.clientY },
      canvas: { x: mouseX, y: mouseY },
      base: { x: clickXBase, y: clickYBase },
    });
    this.currentScreen.components.forEach((component) => {
      component.onClick({
        real: { x: event.clientX, y: event.clientY },
        canvas: { x: mouseX, y: mouseY },
        base: { x: clickXBase, y: clickYBase },
      });
    });
  }

  private onMouseMove(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    // Convert mouse coordinates to base resolution
    const scale = this.canvas.width / 1280;
    const clickXBase = mouseX / scale;
    const clickYBase = mouseY / scale;
    this.currentScreen.onMouseMove({
      real: { x: event.clientX, y: event.clientY },
      canvas: { x: mouseX, y: mouseY },
      base: { x: clickXBase, y: clickYBase },
    });
    this.currentScreen.components.forEach((component) => {
      component.onMouseMove({
        real: { x: event.clientX, y: event.clientY },
        canvas: { x: mouseX, y: mouseY },
        base: { x: clickXBase, y: clickYBase },
      });
    });
  }

  public getRenderInfo(): RenderInfo {
    return {
      ctx: this.ctx,
      canvas: this.canvas,
      game: this.game,
      atlasManager: this.atlasManager,
      state: this.state,
      display: this.display,
    };
  }

  public static async create() {
    const atlasManager = await ClientManager.createAtlasManager();
    return new ClientManager(atlasManager);
  }

  public static async createAtlasManager(): Promise<AtlasManager> {
    const atlasManager = new AtlasManager();
    try {
      // Load atlases
      console.log("Loading entities atlas...");
      await atlasManager.loadAtlas(
        "entities",
        "./src/assets/textures/entities/entities.webp",
        "./src/assets/textures/entities/entities.json",
      );

      console.log("Loading effects atlas...");
      await atlasManager.loadAtlas(
        "effects",
        "./src/assets/textures/effects/effects.webp",
        "./src/assets/textures/effects/effects.json",
      );

      console.log("Loading items atlas...");
      await atlasManager.loadAtlas(
        "items",
        "./src/assets/textures/items/items.webp",
        "./src/assets/textures/items/items.json",
      );

      console.log("All atlases loaded successfully!");
    } catch (error) {
      console.error("Failed to load atlases:", error);
    }
    return atlasManager;
  }

  public setScreen<T extends ClientScreen>(
    screenClass: new (renderInfo: RenderInfo) => T,
  ) {
    this.currentScreen = new screenClass(this.getRenderInfo());
  }
}
