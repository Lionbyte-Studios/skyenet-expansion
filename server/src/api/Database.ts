import { User } from "../../../core/src/DatabaseSchemas";
import { mongo_uri } from "../../../config.json";
import { MongoClient } from "mongodb";

type DatabaseOperationResult = boolean;

const client = new MongoClient(mongo_uri);

const database = client.db("skyenet-expansion");
const users = database.collection<User>("users");

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

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const res = await users.findOne({ username: username });
  if (res === null) return undefined;
  return res;
}