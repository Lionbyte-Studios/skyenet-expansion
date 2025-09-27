import { ShipEngineSprite, ShipSprite } from "../../../core/src/types";
import type { AtlasManager } from "./AtlasManager";

export interface Ship {
  id: string;
  name: string;
  description: string;
  sprite: ShipSprite;
  engineSprite: ShipEngineSprite;
}

export interface GameMenuState {
  currentScreen: "main" | "shipSelection" | "game";
  selectedShip: Ship;
  ships: Ship[];
  isGameRunning: boolean;
}

export class GameMenu {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private atlasManager: AtlasManager;
  private state: GameMenuState;
  private mouseX: number = 0;
  private mouseY: number = 0;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    atlasManager: AtlasManager,
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.atlasManager = atlasManager;

    this.state = {
      currentScreen: "main",
      selectedShip: {
        id: "gray-ship",
        name: "Gray Fighter",
        description: "A reliable starter ship with balanced stats",
        sprite: ShipSprite.Gray,
        engineSprite: ShipEngineSprite.Gray,
      },
      ships: [],
      isGameRunning: false,
    };

    this.setupEventListeners();
    this.loadShips();
  }

  private async loadShips() {
    try {
      const response = await fetch("./src/assets/textures/skins/players.json");
      const data = await response.json();
      this.state.ships = data.ships;
    } catch (error) {
      console.error("Failed to load ships:", error);
    }
  }

  private setupEventListeners() {
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    this.canvas.addEventListener("click", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      if (this.state.currentScreen === "main") {
        this.handleMainMenuClick(clickX, clickY);
      } else if (this.state.currentScreen === "shipSelection") {
        this.handleShipSelectionClick(clickX, clickY);
      }
    });
  }

  private handleMainMenuClick(clickX: number, clickY: number) {
    // Convert click coordinates to base resolution
    const scale = this.canvas.width / 1280;
    const clickXBase = clickX / scale;
    const clickYBase = clickY / scale;

    const baseWidth = 1280;
    const baseHeight = 720;

    // Check if clicked on ship (right side of screen)
    const shipArea = {
      x: baseWidth * 0.6,
      y: baseHeight * 0.3,
      width: baseWidth * 0.3,
      height: baseHeight * 0.4,
    };

    if (
      clickXBase >= shipArea.x &&
      clickXBase <= shipArea.x + shipArea.width &&
      clickYBase >= shipArea.y &&
      clickYBase <= shipArea.y + shipArea.height
    ) {
      this.state.currentScreen = "shipSelection";
    }

    // Check if clicked on "Start Game" button
    const startButton = {
      x: baseWidth * 0.1,
      y: baseHeight * 0.7,
      width: 200,
      height: 60,
    };

    if (
      clickXBase >= startButton.x &&
      clickXBase <= startButton.x + startButton.width &&
      clickYBase >= startButton.y &&
      clickYBase <= startButton.y + startButton.height
    ) {
      this.state.currentScreen = "game";
    }
  }

  private handleShipSelectionClick(clickX: number, clickY: number) {
    // Convert click coordinates to base resolution
    const scale = this.canvas.width / 1280;
    const clickXBase = clickX / scale;
    const clickYBase = clickY / scale;

    const shipItemHeight = 80;
    const startY = 150;

    // Check if clicked on a ship
    for (let i = 0; i < this.state.ships.length; i++) {
      const itemY = startY + i * shipItemHeight;
      if (clickYBase >= itemY && clickYBase <= itemY + shipItemHeight) {
        this.state.selectedShip = this.state.ships[i];
        this.state.currentScreen = "main";
        return;
      }
    }

    // Check if clicked on "Back" button
    const backButton = {
      x: 50,
      y: 50,
      width: 100,
      height: 40,
    };

    if (
      clickXBase >= backButton.x &&
      clickXBase <= backButton.x + backButton.width &&
      clickYBase >= backButton.y &&
      clickYBase <= backButton.y + backButton.height
    ) {
      this.state.currentScreen = "main";
    }
  }

  public render() {
    this.resize();
    // Handle canvas resizing like the original game
    // this.resize();
    this.ctx.imageSmoothingEnabled = false;

    // Clear canvas with transparent background
    this.ctx.fillStyle = "rgba(10, 10, 10, 0.7)"; // Semi-transparent dark overlay
    this.ctx.fillRect(0, 0, 1280, 720);

    if (this.state.currentScreen === "main") {
      this.renderMainMenu();
    } else if (this.state.currentScreen === "shipSelection") {
      this.renderShipSelection();
    }
  }

  private resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = (9 * window.innerWidth) / 16; // 16:9 aspect ratio

    if (this.canvas.height > window.innerHeight) {
      this.canvas.height = window.innerHeight;
      this.canvas.width = (16 * window.innerHeight) / 9;
    }

    // Scale the canvas context
    const scale = this.canvas.width / 1280;
    this.ctx.scale(scale, scale);
  }

  private renderMainMenu() {
    // Use base resolution for positioning (1280x720)
    const baseWidth = 1280;
    const baseHeight = 720;

    // Draw title
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "48px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText("SPACENET", baseWidth / 2, 100);

    // Draw menu items on the left
    this.ctx.font = "24px Arial";
    this.ctx.textAlign = "left";

    // Start Game/Resume button
    this.ctx.fillStyle = "#333333";
    this.ctx.fillRect(baseWidth * 0.1, baseHeight * 0.7, 200, 60);
    this.ctx.fillStyle = "#ffffff";
    const buttonText = this.state.isGameRunning ? "RESUME" : "START GAME";
    this.ctx.fillText(buttonText, baseWidth * 0.1 + 20, baseHeight * 0.7 + 35);

    // Ship selection info
    this.ctx.font = "20px Arial";
    this.ctx.fillText("Selected Ship:", baseWidth * 0.1, baseHeight * 0.3);
    this.ctx.font = "16px Arial";
    this.ctx.fillText(
      this.state.selectedShip.name,
      baseWidth * 0.1,
      baseHeight * 0.35,
    );
    this.ctx.fillText(
      this.state.selectedShip.description,
      baseWidth * 0.1,
      baseHeight * 0.4,
    );

    // Draw ship that follows mouse (right side)
    if (this.atlasManager.areAllLoaded()) {
      // console.log("Atlas is loaded, drawing normal thing");
      this.ctx.save();

      // Calculate ship position to follow mouse but stay on right side
      // Convert mouse coordinates to base resolution
      const scale = this.canvas.width / 1280;
      const mouseXBase = this.mouseX / scale;
      const mouseYBase = this.mouseY / scale;

      const shipX = Math.max(
        baseWidth * 0.6,
        Math.min(baseWidth * 0.9, mouseXBase),
      );
      const shipY = Math.max(
        baseHeight * 0.3,
        Math.min(baseHeight * 0.7, mouseYBase),
      );

      this.ctx.translate(shipX, shipY);
      this.ctx.scale(3, 3);

      this.atlasManager.drawTexture(
        "entities",
        this.state.selectedShip.sprite,
        this.ctx,
        -16,
        -16,
      );

      this.ctx.restore();

      // Draw click instruction
      this.ctx.fillStyle = "#888888";
      this.ctx.font = "14px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        "Click on ship to change",
        baseWidth * 0.75,
        baseHeight * 0.8,
      );
    } else {
      console.log("Atlas not loaded, drawing fallback");
      // Draw fallback rectangle
      this.ctx.fillStyle = "#ff0000";
      this.ctx.fillRect(baseWidth * 0.75 - 25, baseHeight * 0.5 - 25, 50, 50);
    }
  }

  private renderShipSelection() {
    const baseWidth = 1280;
    const baseHeight = 720;

    // Draw background
    this.ctx.fillStyle = "#1a1a1a";
    this.ctx.fillRect(0, 0, baseWidth, baseHeight);

    // Draw title
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "32px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText("SELECT SHIP", baseWidth / 2, 100);

    // Draw back button
    this.ctx.fillStyle = "#333333";
    this.ctx.fillRect(50, 50, 100, 40);
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "16px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText("BACK", 100, 75);

    // Draw ship list
    const shipItemHeight = 80;
    const startY = 150;

    for (let i = 0; i < this.state.ships.length; i++) {
      const ship = this.state.ships[i];
      const itemY = startY + i * shipItemHeight;

      // Highlight selected ship
      if (ship.id === this.state.selectedShip.id) {
        this.ctx.fillStyle = "#444444";
        this.ctx.fillRect(50, itemY, baseWidth - 100, shipItemHeight);
      }

      // Draw ship sprite
      if (this.atlasManager.areAllLoaded()) {
        this.ctx.save();
        this.ctx.translate(100, itemY + 40);
        this.ctx.scale(2, 2);

        this.atlasManager.drawTexture(
          "entities",
          ship.sprite,
          this.ctx,
          -16,
          -16,
        );

        this.ctx.restore();
      }

      // Draw ship info
      this.ctx.fillStyle = "#ffffff";
      this.ctx.font = "20px Arial";
      this.ctx.textAlign = "left";
      this.ctx.fillText(ship.name, 150, itemY + 25);

      this.ctx.font = "14px Arial";
      this.ctx.fillStyle = "#cccccc";
      this.ctx.fillText(ship.description, 150, itemY + 50);
    }
  }

  public getCurrentScreen(): string {
    return this.state.currentScreen;
  }

  public getSelectedShip(): Ship {
    return this.state.selectedShip;
  }

  public setScreen(screen: "main" | "shipSelection" | "game") {
    this.state.currentScreen = screen;
  }

  public setGameRunning(isRunning: boolean) {
    this.state.isGameRunning = isRunning;
  }

  public getGameRunning(): boolean {
    return this.state.isGameRunning;
  }
}
