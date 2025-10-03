import express from "express";
import { createOrUpdateUser, generateUserID, makeSessionObject } from "./Util";
import * as database from "./Database";
import cors from "cors";
import { discord, website_url, api_url, proto } from "../../../config.json";

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
    /*
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
      console.log(result);
      if (result === true) {
        res.status(200).json({ ok: true, user: removePasswordFromUser(user) });
        return;
      } else if (result === false) {
        res.status(500).json({ ok: false });
        return;
      }
    });
*/ /*
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
        console.log("Session undefined");
        res.status(500).json({ ok: false });
        return;
      }

      const createSessionSuccess = await database.createSession(session);
      if (!createSessionSuccess) {
        console.log("Session creation unsuccessful");
        res.status(500).json({ ok: false });
        return;
      }
      res.status(200).json({
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
*/
    this.app.get("/auth", async (req, res) => {
      const code = req.query.code;
      if (code === undefined) {
        res.status(400).send("Bad Request. Failed to authorize.");
        return;
      }
      try {
        const tokenResponseData = await fetch(
          "https://discord.com/api/oauth2/token",
          {
            method: "POST",
            body: new URLSearchParams({
              client_id: discord.client_id,
              client_secret: discord.client_secret,
              code: code as string,
              grant_type: "authorization_code",
              redirect_uri: `${proto}://${api_url}/auth`,
              scope: "email+identify",
            }).toString(),
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        );
        const oauthData: {
          access_token: string;
          token_type: string;
          expires_in: number;
          refresh_token: string;
          scope: string;
        } = await tokenResponseData.json();
        console.log(oauthData);
        const userResult = await fetch("https://discord.com/api/users/@me", {
          headers: {
            authorization: `${oauthData.token_type} ${oauthData.access_token}`,
          },
        });
        const userJson = await userResult.json();
        const maybeUser = await database.getUserByDiscordID(userJson.id);
        const user_id = generateUserID();
        if (maybeUser === undefined) {
          const create_user_res = await createOrUpdateUser({
            id: user_id,
            discord: {
              user_id: userJson.id,
              username: userJson.username,
              email: userJson.email,
              avatar: userJson.avatar,
              global_name: userJson.global_name,
            },
          });
          if (!create_user_res) {
            res.status(500).send("Internal Server Error.");
            return;
          }
        }
        const session = makeSessionObject(
          maybeUser === undefined ? user_id : maybeUser.id,
          {
            discord_session: oauthData,
            discord_user: {
              user_id: userJson.id,
              username: userJson.username,
              email: userJson.email,
              avatar: userJson.avatar,
              global_name: userJson.global_name,
            },
          },
        );
        await database.deleteUserSessions(session.associated_user);
        const db_session_res = await database.createSession(session);
        if (!db_session_res) {
          res.status(500).send("Internal Server Error.");
          return;
        }
        res.status(200).send(`
          <!DOCTYPE html>
          <html>
          <head>
          <title>Redirecting...</title>
          </head>
          <body>
          <p>Redirecting...</p>
          <script>
            const session_token = "${session.token}";
            window.location.href = "${proto}://${website_url}?token=" + session_token;
          </script>
          </body>
          </html>
        `);
      } catch (error) {
        console.error(error);
      }
      // res.sendFile("server/src/api/discord_auth_callback.html", {root: "."});

      // res.status(200).json({code: code});
      // res.sendFile("server/src/api/discord_auth_callback.html");
      // res.send(readFileSync("server/src/api/discord_auth_callback.html").toString());
    });

    this.app.post("/login", async (req, res) => {
      const body: { token: string } = req.body;
      if (typeof body.token !== "string") {
        res.status(400).json({ error: "'token' not provided." });
        return;
      }
      const user_and_session = await database.getUserAndSessionByToken(
        body.token,
      );
      if (user_and_session === undefined) {
        res.status(403).json({ error: "Did not find user/session." });
        return;
      }
      res.status(200).json({
        id: user_and_session[0].id,
        discord: {
          user_id: user_and_session[0].discord.user_id,
          avatar: user_and_session[0].discord.avatar,
          global_name: user_and_session[0].discord.global_name,
          username: user_and_session[0].discord.username,
        },
      });
    });

    this.app.post("/logout", async (req, res) => {
      const body: { token: string } = req.body;
      if (typeof body.token !== "string") {
        res.status(400).json({ error: "'token' not provided." });
        return;
      }
      const user_and_session = await database.getUserAndSessionByToken(
        body.token,
      );
      if (user_and_session === undefined) {
        res.status(403).json({ error: "Did not find user/session." });
        return;
      }
      const delete_res = await database.deleteUserSessions(
        user_and_session[0].id,
      );
      if (!delete_res) {
        res.status(500).json({ error: "Failed to delete session(s)." });
        return;
      }
      res.status(200).json({ ok: true });
    });

    this.app.listen(this.port, () => {
      console.log(`Express listening on port ${port}`);
    });
  }
}
