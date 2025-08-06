import { User } from "./DatabaseSchemas";
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
