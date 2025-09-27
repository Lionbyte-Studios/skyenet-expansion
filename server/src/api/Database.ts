import { Session, User } from "../../../core/src/DatabaseSchemas";
import { mongo_uri } from "../../../config.json";
import { MongoClient } from "mongodb";

type DatabaseOperationResult = boolean;

const client = new MongoClient(mongo_uri);

const database = client.db("skyenet-expansion");
const users = database.collection<User>("users");
const sessions = database.collection<Session>("sessions");

export async function createUser(user: User): Promise<DatabaseOperationResult> {
  const res = await users.insertOne(user);
  return res.acknowledged;
}

export async function deleteUserByID(
  user_id: string,
): Promise<DatabaseOperationResult> {
  const res = await users.deleteOne({ user_id: user_id });
  return res.acknowledged;
}

export async function userWithUsernameExists(
  username: string,
): Promise<boolean> {
  const res = await users.findOne({ username: username });
  if (res === null) return false;
  return true;
}

export async function userWithIDExists(user_id: string): Promise<boolean> {
  const res = await users.findOne({ user_id: user_id });
  if (res === null) return false;
  return true;
}

export async function getUserByID(user_id: string): Promise<User | undefined> {
  const res = await users.findOne({ user_id: user_id });
  if (res === null) return undefined;
  return res;
}

export async function getUserByUsername(
  username: string,
): Promise<User | undefined> {
  const res = await users.findOne({ username: username });
  if (res === null) return undefined;
  return res;
}

export async function getNextSessionID(): Promise<number | undefined> {
  const max = sessions.find().sort({ session_id: -1 }).limit(1); // Find session with biggest session id
  let found: Session | undefined = undefined;
  for await (const doc of max) {
    found = doc;
    break;
  }
  if (found === undefined) return undefined;
  return found.session_id + 1;
}

export async function createSession(
  session: Session,
): Promise<DatabaseOperationResult> {
  const res = await sessions.insertOne(session);
  return res.acknowledged;
}

export async function getSessionBySessionID(
  session_id: number,
): Promise<Session | undefined> {
  const session = await sessions.findOne({ session_id: session_id });
  if (session === null) return undefined;
  return session;
}

export async function deleteSession(
  session_id: number,
): Promise<DatabaseOperationResult> {
  const res = await sessions.deleteOne({ session_id: session_id });
  return res.acknowledged;
}

/**
 * @returns -1 if the query was not acknowledged, the number of deleted sessions otherwise
 */
export async function deleteAllExpiredSessions(): Promise<number> {
  const currentTime = Date.now();
  const res = await sessions.deleteMany({ expires: { $lt: currentTime } });
  if (!res.acknowledged) return -1;
  return res.deletedCount;
}
