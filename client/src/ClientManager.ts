import {
  ShipEngineSprite,
  ShipSprite,
  type LoginCallback,
  type Ship,
} from "../../core/src/types";
import type { ClientGame } from "./ClientGame";
import { AtlasManager } from "./graphics/AtlasManager";
import { ClientScreen } from "./graphics/screen/Screen";
import { ClientStorage } from "./lib/settings/ClientStorage";
import { WebSocketClient } from "./net/WebSocketClient";
import { socket_url } from "../../config.json";
import { login } from "./net/api/Api";

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
  public currentScreen!: ClientScreen;
  public state: ClientState;
  public webSocketManager: WebSocketClient;
  public clientStorage: ClientStorage;
  public atlasManager: AtlasManager;
  public cursor: string = "crosshair";
  public loggedInUser: Promise<LoginCallback> | undefined = undefined;

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

    this.canvas.addEventListener(
      "click",
      (event) => {
        this.onClick(event);
      },
      true,
    );
    this.canvas.addEventListener(
      "mousemove",
      (event) => {
        this.onMouseMove(event);
      },
      true,
    );
    window.addEventListener(
      "keydown",
      (event) => {
        this.onKeyDown(event);
      },
      true,
    );
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
    this.webSocketManager = new WebSocketClient("ws://" + socket_url);
    this.clientStorage = new ClientStorage();
    this.atlasManager = atlasManager;

    // check for ?token=... and if it exists, set it in the localStorage and reload.
    const params = new URLSearchParams(document.location.search);
    const token = params.get("token");
    if (token !== null) {
      // console.log("TOKEN: " + token);
      params.delete("token");
      this.clientStorage.set("token", token);
      window.location.href =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname;
      return;
    }

    // Check for token in localStorage and try logging in with it
    const stored_token = this.clientStorage.get("token");
    if (stored_token !== undefined) {
      this.loggedInUser = new Promise((resolve, reject) => {
        login(stored_token).then((login_res) => {
          if (typeof login_res === "string") {
            console.log("Error logging in: " + login_res);
            reject();
            return;
          }
          console.log("Logged in! Data: " + JSON.stringify(login_res));
          resolve(login_res);
        });
      });
    } else this.loggedInUser = undefined;
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

    this.canvas.style.cursor = this.cursor;
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
    this.cursor = "crosshair";
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

  private onKeyDown(event: KeyboardEvent) {
    this.currentScreen.components.forEach((component) => {
      component.onKeyDown(event);
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
    this.runScreenInit();
  }

  public runScreenInit() {
    this.currentScreen.init();
    this.currentScreen.components.forEach((component) => {
      component.init();
    });
  }
}
