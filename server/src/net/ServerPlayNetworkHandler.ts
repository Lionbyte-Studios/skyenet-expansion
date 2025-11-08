import { ServerPlayListener } from "../../../core/src/net/listener/ServerPlayListener";
import { BulletShootC2SPacket } from "../../../core/src/net/packets/BulletShootC2SPacket";
import { CommandC2SPacket } from "../../../core/src/net/packets/CommandC2SPacket";
import { JoinCallbackS2CPacket } from "../../../core/src/net/packets/JoinCallbackS2CPacket";
import { JoinGameC2SPacket } from "../../../core/src/net/packets/JoinGameC2SPacket";
import { JoinGameS2CPacket } from "../../../core/src/net/packets/JoinGameS2CPacket";
import { PlayerMoveC2SPacket } from "../../../core/src/net/packets/PlayerMoveC2SPacket";
import { PlayerMoveS2CPacket } from "../../../core/src/net/packets/PlayerMoveS2CPacket";
import { getUserAndSessionByToken } from "../api/Database";
import { ServerBullet } from "../entity/ServerBullet";
import { ServerPlayer } from "../entity/ServerPlayer";
import { serverMgr } from "../Main";
import { ServerConnection } from "./ServerConnection";
import { admins } from "../../../.serverconfig.json";
import { PickupItemsC2SPacket } from "../../../core/src/net/packets/PickupItemC2SPacket";
import { ServerItemEntity } from "../entity/ServerItem";
import { distanceSq } from "../../../core/src/util/Util";

export class ServerPlayNetworkHandler extends ServerPlayListener {
  private packetSender: ServerConnection["sendPacket"];
  public player?: ServerPlayer;
  private socket_id: string;

  public override async onJoinGame(packet: JoinGameC2SPacket): Promise<void> {
    // TODO check admin status
    const player = serverMgr.game.generatePlayer(
      packet.selectedShip,
      packet.selectedShipEngine,
      this.packetSender,
    );
    if (packet.token !== undefined) {
      const userAndSession = await getUserAndSessionByToken(packet.token);
      if (userAndSession !== undefined) {
        const id = userAndSession[0].discord.user_id;
        if (admins.includes(id)) {
          player.admin = true;
        }
        player.db_user = userAndSession[0];
        player.db_session = userAndSession[1];
      }
    }
    serverMgr.game.addPlayer(player);
    this.player = player;
    this.packetSender(
      new JoinCallbackS2CPacket(
        player.playerID,
        player.entityID,
        serverMgr.game.gameID,
        // serverMgr.game.players,
        serverMgr.game.entities,
      ),
    );
    serverMgr.wsMgr.broadcastPacket(
      new JoinGameS2CPacket(
        player.playerID,
        player.entityID,
        player.x,
        player.y,
        player.rotation,
        player.shipSprite,
        player.shipEngineSprite,
      ),
      [this.socket_id],
    );
  }
  constructor(packetSender: ServerConnection["sendPacket"], socket_id: string) {
    super();
    this.player = undefined;
    this.packetSender = packetSender;
    this.socket_id = socket_id;
  }
  public override onPlayerMove(packet: PlayerMoveC2SPacket): void {
    if (this.player === undefined) return;
    packet.updatePlayer(this.player);
    serverMgr.wsMgr.broadcastPacket(
      PlayerMoveS2CPacket.fromPlayer(this.player),
      [this.socket_id],
    );
  }

  public override onBulletShoot(packet: BulletShootC2SPacket): void {
    // this.packetSender(
    //   new DebugS2CPacket(
    //     "You shot a bullet"
    //   ),
    // );
    const bullet = new ServerBullet(
      packet.x,
      packet.y,
      packet.velX,
      packet.velY,
      packet.owner,
    );
    serverMgr.game.spawnEntity(bullet);
  }

  public override onCommand(packet: CommandC2SPacket): void {
    if (this.player === undefined) return;
    serverMgr.commandManager.runCommand(packet.command, this.player);
  }

  public override onPickupItem(packet: PickupItemsC2SPacket): void {
    if (this.player === undefined) return;
    const itemEntities: ServerItemEntity[] = serverMgr.game.entities.filter(
      (entity) =>
        entity instanceof ServerItemEntity &&
        packet.items.includes(entity.entityID),
    ) as ServerItemEntity[]; // this is fine because we have checked for instanceof in the filter() function
    for (const item of itemEntities) {
      const distance = distanceSq(this.player.x, this.player.y, item.x, item.y);
      // if item is not in distance, don't pick it up
      if (distance <= serverMgr.game.config.itemPickupRangeSquared)
        this.player.pickupItem(item);
    }
  }
}
