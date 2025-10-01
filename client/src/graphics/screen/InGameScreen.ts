import { GameMode } from "../../../../core/src/types";
import { ClientGame } from "../../ClientGame";
import type { MouseInfo, RenderInfo } from "../../ClientManager";
import { clientManager } from "../../Main";
import { GameRenderer } from "../game/GameRenderer";
import { ClientScreen } from "./Screen";

export class InGameScreen extends ClientScreen {
  public initialized: boolean = false;
  public render(renderInfo: RenderInfo): void {
    if (!this.initialized) return;
    if (clientManager.game === undefined) {
      console.error(
        "Cannot render InGameScreen: clientManager.game is undefined.",
      );
      return;
    }
    clientManager.game.renderer.drawGame(renderInfo);
  }
  public onMouseMove(info: MouseInfo): void {}
  public onClick(info: MouseInfo): void {}
  public async initGame() {
    const selectedShip = clientManager.state.selectedShip;
    clientManager.webSocketManager.joinGame(
      selectedShip.sprite,
      selectedShip.engineSprite,
    );
    const loginInfo = await clientManager.webSocketManager.joinCallbackData;
    console.log(loginInfo);
    clientManager.game = new ClientGame(
      loginInfo.gameID,
      GameMode.FFA,
      loginInfo.playerID,
      loginInfo.entityID,
      // new GameRenderer(clientManager.getRenderInfo()),
    );
    clientManager.game.renderer = new GameRenderer(
      clientManager.getRenderInfo(),
    );
    clientManager.game.players.push(
      ...loginInfo.players.filter(
        (player) => player.playerID !== loginInfo.playerID,
      ),
    );
    clientManager.game.entities.push(...loginInfo.entities);
    console.log(loginInfo.players);
    // Update player's selected ship
    clientManager.game.myPlayer.setShipType(
      selectedShip.sprite,
      selectedShip.engineSprite,
    );
    clientManager.game.startGameLoop();
    this.initialized = true;
  }
}

/*
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
      */
