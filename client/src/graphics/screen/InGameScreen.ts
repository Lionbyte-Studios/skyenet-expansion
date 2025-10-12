import { GameMode } from "../../../../core/src/types";
import { ClientGame } from "../../ClientGame";
import type { RenderInfo } from "../../ClientManager";
import { clientManager } from "../../Main";
import { ChatMessageLogComponent } from "../component/ChatMessageLogComponent";
import { GameRenderer } from "../game/GameRenderer";
import { ClientScreen } from "./Screen";

export interface ChatMessageEntry {
  message: string;
  sender?: string;
  created_at: number;
}

export class InGameScreen extends ClientScreen {
  public initialized: boolean = false;
  private chatMessages: ChatMessageEntry[] = [];
  public consoleShown: boolean = false;
  // Use base resolution for positioning (1280x720)
  // private readonly baseWidth = 1280;
  private readonly baseHeight = 720;
  public render(renderInfo: RenderInfo): void {
    if (!this.initialized) return;
    if (clientManager.game === undefined) {
      console.error(
        "Cannot render InGameScreen: clientManager.game is undefined.",
      );
      return;
    }
    clientManager.game.renderer.drawGame(renderInfo);

    for (const [index, message] of this.chatMessages.entries()) {
      if (Math.abs(message.created_at - Date.now()) > 10000) {
        this.chatMessages.splice(index, 1);
        continue;
      }
    }
    (
      this.components[
        this.getComponentIndexById("chat")!
      ] as ChatMessageLogComponent
    ).args.data.visible = this.consoleShown;
    (
      this.components[
        this.getComponentIndexById("chat")!
      ] as ChatMessageLogComponent
    ).messages = this.chatMessages;
  }
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

  public override init() {
    this.components = [
      new ChatMessageLogComponent({
        x: 10,
        y: this.baseHeight - 10,
        data: {
          visible: false,
        },
        custom_id: "chat",
      }),
    ];
  }

  public addChatMessage(message: string, sender?: string): void {
    this.chatMessages.push({
      message: message,
      sender: sender,
      created_at: Date.now(),
    });
  }

  public selectChatInput() {
    if (this.consoleShown)
      (
        this.components[
          this.getComponentIndexById("chat")!
        ] as ChatMessageLogComponent
      ).input.data.selected = true;
  }
}
