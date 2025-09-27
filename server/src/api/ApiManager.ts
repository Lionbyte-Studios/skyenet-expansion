import express from "express";
import { User } from "../../../core/src/DatabaseSchemas";
import {
  generateToken,
  generateUserID,
  hashPassword,
  isValidEmail,
  isValidUsername,
  makeSessionObject,
  removePasswordFromUser,
} from "./Util";
import * as database from "./Database";
import { ApiErrorType } from "../../../core/src/types";
import cors from "cors";

export class ApiManager {
  private app: express.Express;
  private port: number;
  constructor(port: number = 8082) {
    this.app = express();
    this.port = port;

    this.app.use(cors());
    this.app.use(express.json());

    this.app.get("/", async (req, res) => {
      res.status(200).json({ ok: true });
    });

    this.app.post("/user", async (req, res) => {
      const body: { username: string; email: string; password: string } =
        req.body;
      if (!(typeof body.username === "string")) {
        res.status(400).json({ error: ApiErrorType.UsernameIsNotString });
        return;
      }
      if (!(typeof body.email === "string")) {
        res.status(400).json({ error: ApiErrorType.EmailIsNotString });
        return;
      }
      if (!(typeof body.password === "string")) {
        res.status(400).json({ error: ApiErrorType.PasswordIsNotString });
        return;
      }
      const username = body.username.trim();
      if (!isValidUsername(username)) {
        res.status(400).json({ error: ApiErrorType.InvalidUsername });
        return;
      }
      if (!isValidEmail(body.email)) {
        res.status(400).json({ error: ApiErrorType.InvalidEmail });
        return;
      }
      if (await database.userWithUsernameExists(username)) {
        res.status(400).json({ error: ApiErrorType.UsernameTaken });
        return;
      }

      const user_id = generateUserID();
      const user: User = {
        username: username,
        email: body.email,
        user_id: user_id,
        password: hashPassword(body.password, user_id),
        bio: "",
        statistics: { timesJoinedGame: 0 },
        achievements: [],
      };
      const result = await database.createUser(user);
      if (result === true) {
        res.status(200).json({ ok: true, user: removePasswordFromUser(user) });
        return;
      } else if (result === false) {
        res.status(500).json({ ok: false });
        return;
      }
    });

    this.app.get("/user/:user_id", async (req, res) => {
      const user_id = req.params.user_id;
      const user = await database.getUserByID(user_id);
      if (user === undefined) {
        res.status(404).json({ error: ApiErrorType.UserNotFound });
        return;
      }
      res.status(200).json(user);
    });

    this.app.post("/login", async (req, res) => {
      const body: { username: string; password: string } = req.body;
      if (!(typeof body.username === "string")) {
        res.status(400).json({ error: ApiErrorType.UsernameIsNotString });
        return;
      }
      if (!(typeof body.password === "string")) {
        res.status(400).json({ error: ApiErrorType.PasswordIsNotString });
        return;
      }
      const user = await database.getUserByUsername(body.username);
      if (user === undefined) {
        res.status(404).json({ error: ApiErrorType.InvalidUsername });
        return;
      }
      const hashedPassword = hashPassword(body.password, user.user_id);
      if (hashedPassword !== user.password) {
        res.status(401).json({ error: ApiErrorType.InvalidPassword });
        return;
      }
      const token = generateToken();

      const session = await makeSessionObject(token, user.user_id);
      if (session === undefined) {
        res.status(500).json({ ok: false });
        return;
      }

      const createSessionSuccess = await database.createSession(session);
      if (!createSessionSuccess) {
        res.status(500).json({ ok: false });
        return;
      }
      res
        .status(200)
        .json({
          ok: true,
          session: {
            token: token,
            username: user.username,
            user_id: user.user_id,
            bio: user.bio,
            statistics: user.statistics,
            achievements: user.achievements,
          },
        });
    });

    this.app.listen(this.port, () => {
      console.log(`Express listening on port ${port}`);
    });
  }
}
