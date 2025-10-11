import { GameMode } from "../../core/src/types";
import { ServerGame } from "./ServerGame";
import { genStringID } from "../../core/src/util/Util";
import { WebSocketServerManager } from "./net/WebSocketServer";
import { ApiManager } from "./api/ApiManager";
import { TextDisplay } from "../../core/src/entity/TextDisplay";
import {
  CommandContext,
  CommandExecutionEnvironment,
  CommandManager,
} from "../../core/src/commands/lib/CommandManager";
import { registerCommands } from "./CommandRegisterer";

class ServerCommandExecutionEnvironment extends CommandExecutionEnvironment {
  public sendMessage(message: string, context: CommandContext): void {
    console.log(message);
  }
}

export class ServerManager {
  public game: ServerGame;
  public wsMgr: WebSocketServerManager;
  public commandManager: CommandManager;

  constructor() {
    this.game = new ServerGame(genStringID(8), GameMode.FFA);
    this.wsMgr = new WebSocketServerManager();
    this.commandManager = new CommandManager();
    this.commandManager.setGlobalContext(
      new CommandContext(new ServerCommandExecutionEnvironment()),
    );
    registerCommands(this.commandManager);
  }
}

export const serverMgr = new ServerManager();
serverMgr.game.startGameLoop();

// Start the API (express.js)
export const apiMgr = new ApiManager();

serverMgr.game.spawnEntity(new TextDisplay("hii", 300, -300));
