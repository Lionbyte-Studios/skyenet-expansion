import { sha256 } from "js-sha256";
import { v4 as uuidv4 } from "uuid";
import {
  Session,
  User,
  UserWithOptionalPassword,
  UserWithoutPassword,
} from "../../../core/src/DatabaseSchemas";
import { usernameRegexes } from "../../../core/src/types";
import { randomBytes } from "node:crypto";
import { createUser, getUserByUserID, replaceUser } from "./Database";

export function generateUserID(): string {
  return uuidv4();
}

// User ID is used as salt, a hardcoded salt is added too
export function hashPassword(password: string, user_id: string): string {
  const hardcoded_salt =
    "ad1655715e3a2e743aee4698ccafc16edc818d23493d65eb3ee9cc36a6e5d0ba";
  return sha256(hardcoded_salt + password + user_id);
}

export function removePasswordFromUser(user: User): UserWithoutPassword {
  const optional: UserWithOptionalPassword = user;
  delete optional.password;
  const without: UserWithoutPassword = optional;
  return without;
}

export function isValidUsername(username: string): boolean {
  if (username.length < 3) return false;
  if (username.length > 32) return false;
  for (const regex of usernameRegexes) {
    if (username.match(regex) === null) return false;
  }
  return true;
}

// NOTE: Only validates email length
export function isValidEmail(email: string): boolean {
  if (email.length < 3) return false;
  if (email.length > 64) return false;
  return true;
}

export function generateToken(length: number = 64) {
  return Buffer.from(randomBytes(length)).toString("hex");
}

/**
 * default expiration time is 24 hours
 */
export function makeSessionObject(
  user_id: string,
  discord_data: {
    discord_user: Session["discord_user"];
    discord_session: Session["discord_session"];
  },
): Session {
  return {
    associated_user: user_id,
    token: generateToken(64),
    discord_user: discord_data.discord_user,
    discord_session: discord_data.discord_session,
    created_at: Date.now(),
  };
}

export async function createOrUpdateUser(user: User): Promise<boolean> {
  const find_user_res = await getUserByUserID(user.id);
  if (find_user_res === undefined) {
    const create_user_res = await createUser(user);
    return create_user_res;
  }
  const update_user_res = await replaceUser(user.id, user);
  return update_user_res;
}
