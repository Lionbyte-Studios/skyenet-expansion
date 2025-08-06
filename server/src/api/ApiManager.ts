import * as express from "express";
import { User } from "./DatabaseSchemas";
import { generateUserID, hashPassword, removePasswordFromUser } from "./Util";
import * as database from "./Database";

export class ApiManager {
  private app: express.Express;
  private port: number;
  constructor(port: number = 8082) {
    this.app = express();
    this.port = port;

    this.app.use(express.json());

    this.app.get("/", async (req, res) => {
      res.status(200).json({ ok: true });
    });

    this.app.post("/user/create", async (req, res) => {
      const body: { username: string; email: string; password: string } =
        req.body;
      if (!(typeof body.username === "string")) {
        res.status(400).json({ error: "username is not of type 'string'" });
        return;
      }
      if (!(typeof body.email === "string")) {
        res.status(400).json({ error: "email is not of type 'string'" });
        return;
      }
      if (!(typeof body.password === "string")) {
        res.status(400).json({ error: "password is not of type 'string'" });
        return;
      }
      const user_id = generateUserID();
      const user: User = {
        username: body.username,
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

    this.app.listen(port, () => {
      console.log(`Express listening on port ${port}`);
    });
  }
}
