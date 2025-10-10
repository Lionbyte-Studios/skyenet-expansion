import { ClientManager } from "./ClientManager.js";
import { MainMenuScreen } from "./graphics/screen/MainMenuScreen.js";

export const clientManager: ClientManager = await ClientManager.create();
clientManager.setScreen(MainMenuScreen);
clientManager.startTick();
