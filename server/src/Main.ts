import { GameMode } from "../../core/src/types.d";
import { ServerGame } from "./ServerGame";
import { genStringID } from "../../core/src/util/Util";
import { WebSocketServerManager } from "./net/WebSocketServer";

export class ServerManager {
  public game: ServerGame;
  public wsMgr: WebSocketServerManager;

  constructor() {
    this.game = new ServerGame(genStringID(8), GameMode.FFA);
    this.wsMgr = new WebSocketServerManager();
  }
}

export const serverMgr = new ServerManager();
serverMgr.game.startGameLoop();