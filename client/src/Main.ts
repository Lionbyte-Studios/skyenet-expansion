import { Player } from "../../core/src/entity/Player.js";
import { ClientGame } from "./ClientGame.js";
import { ClientManager } from "./ClientManager.js";
import { ClientPlayer } from "./entity/ClientPlayer.js";
import { MainMenuScreen } from "./graphics/screen/MainMenuScreen.js";

ClientGame.registerEntities();
Player.registerPlayerClass(ClientPlayer);
export const clientManager: ClientManager = await ClientManager.create();
clientManager.setScreen(MainMenuScreen);
clientManager.startTick();
