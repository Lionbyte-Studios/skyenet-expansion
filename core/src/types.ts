import z from "zod";
import {
  BulletShootMessage,
  KillEntitiesMessage,
  ModifyEntitiesMessage,
  MovementMessage,
  PlayerJoinMessage,
  PlayerJoinMessageCallback,
  SpawnEntitiesMessage,
  StatusMessage,
  UpdatePlayersMessage,
} from "./Schemas";

export enum WebSocketMessageType {
  Status,
  ServerError,
  Movement,
  Authentication,
  AuthenticationCallback,
  PlayerJoin,
  PlayerJoinCallback,
  UpdatePlayers,
  SpawnEntities,
  KillEntities,
  ModifyEntities,
  BulletShoot,
}

export type MovementMessage = z.infer<typeof MovementMessage>;
export type StatusMessage = z.infer<typeof StatusMessage>;
export type PlayerJoinCallbackMessage = z.infer<
  typeof PlayerJoinMessageCallback
>;
export type UpdatePlayersMessage = z.infer<typeof UpdatePlayersMessage>;
export type PlayerJoinMessage = z.infer<typeof PlayerJoinMessage>;
export type SpawnEntitiesMessage = z.infer<typeof SpawnEntitiesMessage>;
export type ModifyEntitiesMessage = z.infer<typeof ModifyEntitiesMessage>;
export type KillEntitiesMessage = z.infer<typeof KillEntitiesMessage>;
export type BulletShootMessage = z.infer<typeof BulletShootMessage>;

export enum ShipSprite {
  Gray = "gray-ship",
  Blue = "blue-ship",
  White = "white-ship",
  Black = "black-ship",
}
export enum ShipEngineSprite {
  Gray = "gray-ship-engine",
  Blue = "blue-ship-engine",
  White = "white-ship-engine",
  Black = "black-ship-engine",
}
export type PlayerID = string;
export type GameID = string;
export type EntityID = string;

export enum GameMode {
  FFA,
}

export const alphabetForID =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
