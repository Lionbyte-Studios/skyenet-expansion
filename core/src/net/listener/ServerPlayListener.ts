import { JoinGameC2SPacket } from "../packets/JoinGameC2SPacket";
import { PlayerMoveC2SPacket } from "../packets/PlayerMoveC2SPacket";
import { PlayListener } from "./PlayListener";

export abstract class ServerPlayListener extends PlayListener {
  public abstract onPlayerMove(packet: PlayerMoveC2SPacket): void;
  public abstract onJoinGame(packet: JoinGameC2SPacket): void;
}
