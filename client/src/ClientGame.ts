import { Game } from "../../core/src/Game";
import type {
  EntityID,
  GameID,
  GameMode,
  PlayerID,
} from "../../core/src/types.d";
import type { ClientPlayer } from "./entity/ClientPlayer";
import { MyPlayer } from "./entity/MyPlayer";
import { Camera } from "./lib/Camera";
import { KeyManager } from "./lib/Keyman";
import { Debug } from "./lib/Debug";
import { ClientSettings } from "./lib/settings/ClientSettings";
import { clientStorage } from "./Main";

export class ClientGame extends Game {
  public players: ClientPlayer[] = [];
  public keyManager = new KeyManager();
  public camera = new Camera(this);
  public myPlayer: MyPlayer;
  public debug = new Debug(this);
  public stars: {
    x: number;
    y: number;
    z?: number;
    velX?: number;
    velY?: number;
    size?: number;
  }[] = [];
  public clientSettings: ClientSettings;

  constructor(
    gameID: GameID,
    gameMode: GameMode,
    myPlayerID: PlayerID,
    myEntityID: EntityID,
  ) {
    super(gameID, gameMode);
    this.myPlayer = new MyPlayer(
      myPlayerID,
      myEntityID,
      this.config.defaultSpawnCoords.x,
      this.config.defaultSpawnCoords.y,
      0,
      this.config.defaultShipSprite,
      this.config.defaultShipEngineSprite,
    );
    this.players[0] = this.myPlayer;
    for (let i = 0; i < 50; i++) {
      this.stars.push({
        x: -30 + Math.random() * 1330,
        y: -30 + Math.random() * 770,
        z: 5 + Math.random() * 4,
      });
    }
    const settings = clientStorage.get("settings", ClientSettings);
    if (settings === undefined) this.clientSettings = new ClientSettings();
    else this.clientSettings = settings;
    console.log("Client Settings: " + JSON.stringify(this.clientSettings));
    this.saveSettings();
  }

  public tick() {
    this.players
      .filter((player) => player.playerID !== this.myPlayer.playerID)
      .forEach((player) => player.move());
    this.entities.forEach((entity) => entity.tick());
  }

  public saveSettings() {
    this.clientSettings.save();
  }
}
