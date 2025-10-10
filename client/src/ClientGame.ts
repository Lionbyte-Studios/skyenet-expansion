import { Game } from "../../core/src/Game";
import type {
  EntityID,
  GameID,
  GameMode,
  PlayerID,
} from "../../core/src/types";
import type { ClientPlayer } from "./entity/ClientPlayer";
import { MyPlayer } from "./entity/MyPlayer";
import { Camera } from "./graphics/game/Camera";
import { KeyManager } from "./lib/Keyman";
import { Debug } from "./lib/Debug";
import { ClientSettings } from "./lib/settings/ClientSettings";
import { GameLoopManager } from "../../core/src/GameLoopManager";
import { clientManager } from "./Main";
import type { GameRenderer } from "./graphics/game/GameRenderer";

export interface ClientGameStats {
  fps: number;
  tps: number;
  ticksThisSecond: number;
  framesThisSecond: number;
  lastTickSecondTimestamp: number;
  lastFrameSecondTimestamp: number;
}

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
  public stats: ClientGameStats;
  private gameLoopManager: GameLoopManager;
  public renderer!: GameRenderer;

  constructor(
    gameID: GameID,
    gameMode: GameMode,
    myPlayerID: PlayerID,
    myEntityID: EntityID,
    // renderer: GameRenderer,
  ) {
    super(gameID, gameMode);
    this.stats = {
      fps: 0,
      tps: 0,
      lastTickSecondTimestamp: Date.now(),
      lastFrameSecondTimestamp: Date.now(),
      ticksThisSecond: 0,
      framesThisSecond: 0,
    };
    // this.renderer = renderer;
    this.gameLoopManager = new GameLoopManager(() => {
      this.tick();
    }, this.config.tps);
    this.myPlayer = new MyPlayer(
      myPlayerID,
      myEntityID,
      this.config.defaultSpawnCoords.x,
      this.config.defaultSpawnCoords.y,
      0,
      this.config.defaultShipSprite,
      this.config.defaultShipEngineSprite,
    );
    this.players = [this.myPlayer];
    for (let i = 0; i < 50; i++) {
      this.stars.push({
        x: -30 + Math.random() * 1330,
        y: -30 + Math.random() * 770,
        z: 5 + Math.random() * 4,
      });
    }
    const raw_settings = clientManager.clientStorage.get("settings");
    let settings;
    if (raw_settings === undefined) settings = new ClientSettings();
    else settings = ClientSettings.from(raw_settings);
    this.clientSettings = settings;
    console.log("Client Settings: " + JSON.stringify(this.clientSettings));
    this.saveSettings();
  }

  public override tick() {
    const lastTickTimestamp = Date.now();
    if (this.stats.lastTickSecondTimestamp + 1000 < lastTickTimestamp) {
      this.stats.lastTickSecondTimestamp = lastTickTimestamp;
      this.stats.tps = this.stats.ticksThisSecond;
      this.stats.ticksThisSecond = 1;
    } else this.stats.ticksThisSecond++;

    this.entities.forEach((entity) => {
      entity.tick(this);
    });
    this.keyManager.update();
    this.myPlayer.tick(this);
    this.camera.tick();
    this.debug.tick();
  }

  public saveSettings() {
    this.clientSettings.save();
  }

  public startGameLoop() {
    this.gameLoopManager.start();
  }
  public stopGameLoop() {
    this.gameLoopManager.stop();
  }
}
