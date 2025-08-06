import z from "zod";
import {
  BulletMessage,
  MovementMessage,
  PlayerJoinMessage,
  PlayerJoinMessageCallback,
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
  BulletMessage,
}

export type MovementMessage = z.infer<typeof MovementMessage>;
export type StatusMessage = z.infer<typeof StatusMessage>;
export type PlayerJoinCallbackMessage = z.infer<
  typeof PlayerJoinMessageCallback
>;
export type UpdatePlayersMessage = z.infer<typeof UpdatePlayersMessage>;
export type BulletMessage = z.infer<typeof BulletMessage>;
export type PlayerJoinMessage = z.infer<typeof PlayerJoinMessage>;

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

export enum EntityType {
  Bullet,
  Asteroid,
}

export enum ApiErrorType {
  UsernameIsNotString,
  EmailIsNotString,
  PasswordIsNotString,
  UsernameTooShort,
  UsernameTaken,
}
