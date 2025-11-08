import type { JoinCallbackS2CPacket } from "../../../../core/src/net/packets/JoinCallbackS2CPacket";
import { JoinGameC2SPacket } from "../../../../core/src/net/packets/JoinGameC2SPacket";
import { GameMode } from "../../../../core/src/types";
import { ClientGame } from "../../ClientGame";
import type { RenderInfo } from "../../ClientManager";
import { ClientPlayer } from "../../entity/ClientPlayer";
import { clientManager } from "../../Main";
import { ChatMessageLogComponent } from "../component/ChatMessageLogComponent";
import { TextComponent } from "../component/TextComponent";
import { GameRenderer } from "../game/GameRenderer";
import { ClientScreen } from "./Screen";

export interface ChatMessageEntry {
  message: string;
  created_at: number;
}

export class InGameScreen extends ClientScreen {
  public state: "uninitialized" | "waitingforjoincallbackdata" | "gamerunning" =
    "uninitialized";
  private chatMessages: ChatMessageEntry[] = [];
  public consoleShown: boolean = false;
  // Use base resolution for positioning (1280x720)
  private readonly baseWidth = 1280;
  private readonly baseHeight = 720;
  public render(renderInfo: RenderInfo): void {
    if (this.state !== "gamerunning") return;
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
  public initGame() {
    this.state = "waitingforjoincallbackdata";
    const selectedShip = clientManager.state.selectedShip;
    const token = clientManager.clientStorage.get("token");
    clientManager.webSocketClient.connection.sendPacket(
      new JoinGameC2SPacket(
        selectedShip.sprite,
        selectedShip.engineSprite,
        token,
      ),
    );
  }
  public joinCallback(data: JoinCallbackS2CPacket) {
    console.log(data);
    clientManager.game = new ClientGame(
      data.gameID,
      GameMode.FFA,
      data.playerID,
      data.entityID,
      // new GameRenderer(clientManager.getRenderInfo()),
    );
    clientManager.game.renderer = new GameRenderer(
      clientManager.getRenderInfo(),
    );
    const playersToPush: ClientPlayer[] = [];
    data.players.forEach((player) => {
      if (player.playerID === data.playerID) return;
      playersToPush.push(
        new ClientPlayer(
          player.playerID,
          player.entityID,
          player.x,
          player.y,
          player.rotation,
          player.shipSprite,
          player.shipEngineSprite,
        ),
      );
    });
    clientManager.game.players.push(...playersToPush);
    clientManager.game.entities.push(...data.entities);
    console.log(data.players);
    // Update player's selected ship
    const selectedShip = clientManager.state.selectedShip;
    clientManager.game.myPlayer.setShipType(
      selectedShip.sprite,
      selectedShip.engineSprite,
    );
    clientManager.game.startGameLoop();
    this.state = "gamerunning";
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
      new TextComponent({
        x: this.baseWidth - 10,
        y: this.baseHeight - 10,
        data: {
          text: "Coins: 0",
          textProperties: {
            align: "right",
          },
        },
        custom_id: "coin_display",
      }),
    ];
    this.initGame();
  }

  public addChatMessage(message: string): void {
    this.chatMessages.push({
      message: message,
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
