import { ClientGame } from "./ClientGame.js";
import { GameRenderer } from "./lib/GameRenderer.js";
import { GameMenu } from "./lib/GameMenu.js";
import { AtlasManager } from "./lib/AtlasManager.js";
/*import {
  entitiesFromJoin,
  getEntityID,
  getGameID,
  getPlayerID,
  initWebSocket,
  joinGame,
  playersFromJoin,
} from "./WebSocket.old.js";*/
import { GameMode } from "../../core/src/types.js";
import { ClientStorage } from "./lib/settings/ClientStorage.js";
import { WebSocketClient } from "./net/WebSocketClient.js";

export let game: ClientGame;
let renderer: GameRenderer;
let menu: GameMenu;
export let atlasManager: AtlasManager;
let gameState: "menu" | "playing" = "menu";
export const clientStorage = new ClientStorage();
export let webSocketManager: WebSocketClient;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
  </div>
`;

// Disable right click
document.addEventListener("contextmenu", (event) => event.preventDefault());

const canvas = document.getElementById("screen") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const display = { startWidth: 1280, aspectRatio: [16, 9], scale: 0 };
let gameStartRequested: boolean = false;

/*
async function initializeGame() {
  console.log("Starting game initialization...");
  initWebSocket();

  // Initialize atlas manager
  atlasManager = new AtlasManager();

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

  // Initialize menu
  console.log("Initializing menu...");
  menu = new GameMenu(canvas, ctx, atlasManager);

  // Initialize game (but don't start it yet)
  console.log("Initializing game...");
  console.log("[authenticating] Waiting for server response...");
  const gameID = await getGameID();
  const playerID = await getPlayerID();
  console.log(`Received authentication: gameID=${gameID} playerID=${playerID}`);
/////  game = new ClientGame(gameID, GameMode.FFA, playerID);
  renderer = new GameRenderer(ctx, display, game, atlasManager);

  console.log("Game initialization complete!");
}
*/

function tick() {
  requestAnimationFrame(tick);

  if (gameState === "menu") {
    menu.render();

    // Check if user wants to start/resume game
    if (menu.getCurrentScreen() === "game" && !gameStartRequested) {
      gameStartRequested = true;
      (async () => {
        const selectedShip = menu.getSelectedShip();
        webSocketManager.joinGame(
          selectedShip.sprite,
          selectedShip.engineSprite,
        );
        const loginInfo = await webSocketManager.joinCallbackData;
        console.log(loginInfo);
        game = new ClientGame(
          loginInfo.gameID,
          GameMode.FFA,
          loginInfo.playerID,
          loginInfo.entityID,
        );
        game.players.push(
          ...loginInfo.players.filter(
            (player) => player.playerID !== loginInfo.playerID,
          ),
        );
        game.entities.push(...loginInfo.entities);
        console.log(loginInfo.players);
        gameState = "playing";
        menu.setGameRunning(true);
        // Update player's selected ship
        game.myPlayer.setShipType(
          selectedShip.sprite,
          selectedShip.engineSprite,
        );
        renderer = new GameRenderer(ctx, display, game, atlasManager);
        game.startGameLoop();
      })();
    }
  } else if (gameState === "playing") {
    // // Check for escape key to return to menu
    // if (game.keyManager.wasKeyJustPressed("Escape")) {
    //   gameState = "menu";
    //   menu.setScreen("main");
    //   return;
    // }

    renderer.drawGame(game);
  }
}

async function initMenu() {
  console.log("Starting game initialization...");
  webSocketManager = new WebSocketClient("ws://localhost:8081");

  // Initialize atlas manager
  atlasManager = new AtlasManager();

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

  // Initialize menu
  console.log("Initializing menu...");
  menu = new GameMenu(canvas, ctx, atlasManager);
  // menu.render();
  tick();

  //// Initialize game (but don't start it yet)
  //console.log("Initializing game...");
  //console.log("[authenticating] Waiting for server response...");
  //const gameID = await getGameID();
  //const playerID = await getPlayerID();
  //console.log(`Received authentication: gameID=${gameID} playerID=${playerID}`);
  //game = new ClientGame(gameID, GameMode.FFA, playerID);
  //renderer = new GameRenderer(ctx, display, game, atlasManager);
  //
  //console.log("Game initialization complete!");
}

/*
// Initialize and start the game
initializeGame()
  .then(() => {
    console.log("Starting game loop...");
    tick();
  })
  .catch((error) => {
    console.error("Failed to initialize game:", error);
    // Draw error message on canvas
    ctx.fillStyle = "#ff0000";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      "Error loading game: " + error.message,
      canvas.width / 2,
      canvas.height / 2,
    );
  });
*/

initMenu();
