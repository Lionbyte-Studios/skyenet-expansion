import { Session, User } from "../../../core/src/DatabaseSchemas";
import { mongo_uri } from "../../../config.json";
import { MongoClient, UpdateFilter } from "mongodb";

type DatabaseOperationResult = boolean;

const client = new MongoClient(mongo_uri);

const database = client.db("skyenet-expansion");
const users = database.collection<User>("users");
const sessions = database.collection<Session>("sessions");

export async function createUser(user: User): Promise<DatabaseOperationResult> {
  const res = await users.insertOne(user);
  return res.acknowledged;
}

export async function updateUser(
  user_id: string,
  updateData: UpdateFilter<User>,
): Promise<boolean> {
  const res = await users.updateOne({ id: user_id }, updateData);
  return res.acknowledged;
}

export async function replaceUser(
  user_id: string,
  newUser: User,
): Promise<boolean> {
  const res = await users.replaceOne({ id: user_id }, newUser);
  return res.acknowledged;
}

export async function getUserByUserID(
  user_id: string,
): Promise<User | undefined> {
  const res = await users.findOne({ id: user_id });
  if (res === null) return undefined;
  return res;
}

export async function deleteUserByDiscordID(
  user_id: string,
): Promise<DatabaseOperationResult> {
  const res = await users.deleteOne({ discord: { user_id: user_id } });
  return res.acknowledged;
}

export async function userWithDiscordUsernameExists(
  username: string,
): Promise<boolean> {
  const res = await users.findOne({ discord: { username: username } });
  if (res === null) return false;
  return true;
}

export async function userWithDiscordIDExists(
  user_id: string,
): Promise<boolean> {
  const res = await users.findOne({ discord: { user_id: user_id } });
  if (res === null) return false;
  return true;
}

export async function getUserByDiscordID(
  user_id: string,
): Promise<User | undefined> {
  const res = await users.findOne({ discord: { user_id: user_id } });
  if (res === null) return undefined;
  return res;
}

export async function getUserByDiscordUsername(
  username: string,
): Promise<User | undefined> {
  const res = await users.findOne({ discord: { username: username } });
  if (res === null) return undefined;
  return res;
}

export async function createSession(
  session: Session,
): Promise<DatabaseOperationResult> {
  const res = await sessions.insertOne(session);
  return res.acknowledged;
}

export async function getSessionByAssociatedUserID(
  associated_user_id: string,
): Promise<Session | undefined> {
  const res = await sessions.findOne({ associated_user: associated_user_id });
  if (res === null) return undefined;
  return res;
}

export async function deleteUserSessions(user_id: string): Promise<boolean> {
  const res = await sessions.deleteMany({ associated_user: user_id });
  return res.acknowledged;
}

export async function getUserAndSessionByToken(
  token: string,
): Promise<[User, Session] | undefined> {
  const session = await sessions.findOne({ token: token });
  if (session === null) return undefined;
  const user = await users.findOne({ id: session.associated_user });
  if (user === null) return undefined;
  return [user, session];
}
