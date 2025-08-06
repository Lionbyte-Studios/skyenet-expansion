import { sha256 } from "js-sha256";
import { v4 as uuidv4 } from "uuid";
import {
  User,
  UserWithOptionalPassword,
  UserWithoutPassword,
} from "../../../core/src/DatabaseSchemas";
import { usernameRegexes } from "../../../core/src/types";

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
  for (const regex in usernameRegexes) {
    if (regex.match(username) === null) return false;
  }
  return true;
}

// NOTE: Only validates email length
export function isValidEmail(email: string): boolean {
  if (email.length < 3) return false;
  if (email.length > 64) return false;
  return true;
}
