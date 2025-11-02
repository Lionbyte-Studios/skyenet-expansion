import { GameMode, PlayerID } from "../../core/src/types";
import { ServerGame } from "./ServerGame";
import { genStringID } from "../../core/src/util/Util";
import { WebSocketServerManager } from "./net/WebSocketServer";
import { ApiManager } from "./api/ApiManager";
import {
  CommandContext,
  CommandExecutionEnvironment,
  CommandManager,
  CommandSource,
} from "../../core/src/commands/lib/CommandManager";
import { registerCommands } from "./CommandRegisterer";
import { ServerTextDisplay } from "./entity/ServerTextDisplay";
import { Player } from "../../core/src/entity/Player";
import { ServerPlayer } from "./entity/ServerPlayer";
import { ServerConnection } from "./net/ServerConnection";
import { ChatMessageS2CPacket } from "../../core/src/net/packets/ChatMessageS2CPacket";

class ServerCommandExecutionEnvironment extends CommandExecutionEnvironment {
  public sendMessage(message: string, context: CommandContext): void {
    console.log(message);
  }
}

export class ServersideCommandSource extends CommandSource<ServerPlayer> {
  constructor(
    playerID: PlayerID,
    socket_id: string,
    player: ServerPlayer,
    public packetSender: ServerConnection["sendPacket"],
  ) {
    super(playerID, socket_id, player);
  }
  public sendMessage(message: string): void {
    this.packetSender(new ChatMessageS2CPacket(message));
  }
}

export class ServerManager {
  public game: ServerGame;
  public wsMgr: WebSocketServerManager;
  public commandManager: CommandManager<ServerPlayer>;

  constructor() {
    ServerGame.registerEntities();
    this.game = new ServerGame(genStringID(8), GameMode.FFA);
    this.wsMgr = new WebSocketServerManager();
    this.commandManager = new CommandManager();
    this.commandManager.setGlobalContext(
      new CommandContext(new ServerCommandExecutionEnvironment()),
    );
    registerCommands(this.commandManager);
  }
}

Player.registerPlayerClass(ServerPlayer);

export const serverMgr = new ServerManager();
serverMgr.game.startGameLoop();

// Start the API (express.js)
export const apiMgr = new ApiManager();

serverMgr.game.spawnEntity(new ServerTextDisplay("hii", 300, -300));
