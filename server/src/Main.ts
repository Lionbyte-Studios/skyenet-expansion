import { GameMode } from "../../core/src/types";
import { ServerGame } from "./ServerGame";
import { genStringID } from "../../core/src/util/Util";
import { WebSocketServerManager } from "./net/WebSocketServer";
import { ApiManager } from "./api/ApiManager";

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

// Start the API (express.js)
export const apiMgr = new ApiManager();
