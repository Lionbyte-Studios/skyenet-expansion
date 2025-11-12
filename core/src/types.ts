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

export const usernameRegexes = [/^[a-zA-Z0-9_.-]+$/gm, /[a-zA-Z]/gm];

export enum ApiErrorType {
  UsernameIsNotString,
  EmailIsNotString,
  PasswordIsNotString,
  InvalidUsername,
  UsernameTaken,
  InvalidEmail,
  UserNotFound,
  InvalidPassword,
  InternalServerError,
}

export interface Ship {
  id: string;
  name: string;
  description: string;
  sprite: ShipSprite;
  engineSprite: ShipEngineSprite;
}

export interface LoginCallback {
  id: string;
  discord: {
    user_id: string;
    avatar: string;
    global_name: string;
    username: string;
  };
}

export interface LogoutCallback {
  ok: boolean;
}
