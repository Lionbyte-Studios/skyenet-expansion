import { GameMode } from "../../core/src/types";
import { ServerGame } from "./ServerGame";
import { genStringID } from "../../core/src/util/Util";
import {
  WebSocketClientWithData,
  WebSocketServerManager,
} from "./net/WebSocketServer";
import { ApiManager } from "./api/ApiManager";
import {
  CommandContext,
  CommandExecutionEnvironment,
  CommandManager,
  CommandSource,
} from "../../core/src/commands/lib/CommandManager";
import { registerCommands } from "./CommandRegisterer";
import { ChatMessage } from "../../core/src/Schemas";
import { ServerTextDisplay } from "./entity/ServerTextDisplay";
import { Player } from "../../core/src/entity/Player";
import { ServerPlayer } from "./entity/ServerPlayer";

class ServerCommandExecutionEnvironment extends CommandExecutionEnvironment {
  public sendMessage(message: string, context: CommandContext): void {
    console.log(message);
  }
}

export class ServersideCommandSource extends CommandSource {
  public sendMessage(message: string): void {
    serverMgr.wsMgr.wss.clients.forEach((client: WebSocketClientWithData) => {
      if (client.data!.socket_id !== this.socket_id) return;
      client.send(
        JSON.stringify(
          ChatMessage.parse({
            message: message,
          }),
        ),
      );
    });
  }
}

export class ServerManager {
  public game: ServerGame;
  public wsMgr: WebSocketServerManager;
  public commandManager: CommandManager;

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
