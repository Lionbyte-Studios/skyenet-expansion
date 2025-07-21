import { Player } from "../../core/src/entity/Player";
import { Game } from "../../core/src/Game";
import { GameLoopManager } from "../../core/src/GameLoopManager";
import { GameID, GameMode, MessageType } from "../../core/src/types.d";
import { genStringID } from "../../core/src/util/Util";

export interface ServerGameStats {
  tps: number;
  ticksThisSecond: number;
  lastTickSecondTimestamp: number;
}

export class ServerGame extends Game {
  private gameLoopManager: GameLoopManager;
  public stats: ServerGameStats;

  constructor(gameID: GameID, gameMode: GameMode) {
    super(gameID, gameMode);
    this.gameLoopManager = new GameLoopManager(
      () => this.tick(),
      this.config.tps,
    );
    this.stats = {
      tps: 0,
      lastTickSecondTimestamp: Date.now(),
      ticksThisSecond: 0,
    };
    setInterval(() => this.logStats(), 1000);
  }

  private logStats() {
    console.log(`TPS: ${this.stats.tps}`);
  }

  public handleMovementMessage(message: MessageType.MovementMessage) {
    console.log(message);
  }
  public handleStatusMessage(message: MessageType.StatusMessage) {
    console.log(message);
  }
  public static generateRandomPlayerID() {
    return genStringID(8);
  }
  public generatePlayer(): Player {
    const id = ServerGame.generateRandomPlayerID();
    const entityID = genStringID(8);
    return new Player(
      id,
      entityID,
      this.config.defaultSpawnCoords.x,
      this.config.defaultSpawnCoords.y,
      0,
      this.config.defaultShipSprite,
      this.config.defaultShipEngineSprite,
    );
  }

  public override tick() {
    const lastTickTimestamp = Date.now();
    if (this.stats.lastTickSecondTimestamp + 1000 < lastTickTimestamp) {
      this.stats.lastTickSecondTimestamp = lastTickTimestamp;
      this.stats.tps = this.stats.ticksThisSecond;
      this.stats.ticksThisSecond = 1;
    } else this.stats.ticksThisSecond++;
    // this.lastTickTimestamp = Date.now();
    // this.players.forEach(player => player.tick());
    this.entities.forEach((entity) => {
      // if(entity instanceof Player) return;
      entity.tick();
    });
    // setTimeout(() => this.tick(), calculateNextTickTimeRemaining(this.config.tps, this.lastTickTimestamp));
  }

  public startGameLoop() {
    this.gameLoopManager.start();
  }
  public stopGameLoop() {
    this.gameLoopManager.stop();
  }
}
