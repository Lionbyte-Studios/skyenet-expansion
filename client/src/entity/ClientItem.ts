import { ItemEntity, ItemState } from "../../../core/src/entity/Item";
import type { Game } from "../../../core/src/Game";
import { ItemMaterial, ItemStack } from "../../../core/src/item/ItemStack";
import type { PacketBuffer } from "../../../core/src/net/PacketBuffer";
import type { EntityID } from "../../../core/src/types";
import { randomNumberInRange } from "../../../core/src/util/Util";
import type { RenderInfo } from "../ClientManager";
import { clientManager } from "../Main";
import { ClientPlayer } from "./ClientPlayer";
import type { RenderableEntity } from "./RenderableEntity";

const itemTypeTextureMap = new Map<ItemMaterial, string>([
  [ItemMaterial.GOLD, "coin"],
]);

export class ClientItemEntity extends ItemEntity implements RenderableEntity {
  public rotation: number;
  public velR: number;
  private timeInPickingUpState = 0;

  constructor(x: number, y: number, item: ItemStack, entityID?: EntityID) {
    super(x, y, item, entityID);
    this.rotation = randomNumberInRange(0, 360 - 1);
    this.velR = 1;
  }

  render(info: RenderInfo): void {
    const textureName = itemTypeTextureMap.get(this.item.material);
    if (textureName === undefined) return;
    clientManager.atlasManager.drawInGameTextureCenteredRotated(
      "items",
      textureName,
      info.ctx,
      this.x,
      this.y,
      this.rotation,
      info,
    );
  }

  public static override netRead(buf: PacketBuffer): ClientItemEntity {
    const x = buf.readFloat();
    const y = buf.readFloat();
    const entityID = buf.readString();
    const item: ItemStack = ItemStack.netRead(buf);
    return new ClientItemEntity(x, y, item, entityID);
  }

  public override tick<T extends Game>(game?: T | undefined): void {
    // we are updating rotation only on the client because it doesn't affect gameplay
    this.rotation += this.velR;
    if (this.rotation >= 360) this.rotation = 0;
    if (this.state === ItemState.PickingUp) {
      // NOTE that in this state the entity is client-side only.
      this.timeInPickingUpState++;
      const playerPickingUp = clientManager.game.entities.find(
        (entity) =>
          entity instanceof ClientPlayer &&
          entity.playerID === this.playerPickingUp,
      ) as ClientPlayer;
      // if player not found, kill
      if (playerPickingUp === undefined) {
        this.kill();
        return;
      }
      const xDiff = playerPickingUp.x - this.x;
      const yDiff = playerPickingUp.y - this.y;
      // if difference is small enough or too big, kill entity
      if ((xDiff < 10 && yDiff < 10) || xDiff > 75 || yDiff > 75) {
        this.kill();
        return;
      }
      if (this.timeInPickingUpState > clientManager.game.config.tps * 1.5) {
        this.kill();
        return;
      }
      // move towards player
      this.x += xDiff / 10 + 3;
      this.y += yDiff / 10 + 3;
    }
  }

  private kill() {
    clientManager.game.entities.splice(
      clientManager.game.entities.findIndex(
        (entity) => entity.entityID === this.entityID,
      ),
      1,
    );
  }
}
