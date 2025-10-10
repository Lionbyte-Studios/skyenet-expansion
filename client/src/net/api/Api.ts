import {
  type LoginCallback,
  type LogoutCallback,
} from "../../../../core/src/types";

// /**
//  * Calls the API to create a user.
//  * @param username Username
//  * @param email E-Mail
//  * @param password Password (raw unencrypted)
//  * @returns If the API call succeeded without any errors, returns an object with `user` being defined and `error` undefined. Else, returns an object with `user` undefined and `error` defined as a `ApiErrorType`.
//  */
// export async function createUser(
//   username: string,
//   email: string,
//   password: string,
// ): Promise<{ user: User; error: undefined } | { user: undefined; error: ApiErrorType}> {
//   const res = await fetch("http://localhost:8082/user", {
//     method: "POST",
//     headers: {
//       Accept: "application/json, text/plain, */*",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       username: username,
//       password: password,
//       email: email,
//     }),
//   });
//   const json = await res.json();
//   console.log("create user json: " + json);
//   if ("error" in json) {
//     return { user: undefined, error: json.error };
//   }
//   if (!json.ok) {
//     return { user: undefined, error: ApiErrorType.InternalServerError };
//   }
//   return { user: json, error: undefined };
// }
//
// /**
//  * Calls the API to create a session.
//  * @param username Username
//  * @param password Password
//  * @returns If the API call succeeded without any errors, returns an object with `session` being defined and `error` undefined. Else, returns an object with `session` undefined and `error` defined as a `ApiErrorType`.
//  */
// export async function login(
//   username: string,
//   password: string,
// ): Promise<{ session: Session; error: undefined } | { session: undefined; error: ApiErrorType }> {
//   const res = await fetch("http://localhost:8082/login", {
//     method: "POST",
//     headers: {
//       Accept: "application/json, text/plain, */*",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       username: username,
//       password: password,
//     }),
//   });
//
//   const json = await res.json();
//   if ("error" in json) {
//     return { session: undefined, error: json.error };
//   }
//   if (!json.ok) {
//     return { session: undefined, error: ApiErrorType.InternalServerError };
//   }
//   return { session: json.session, error: undefined };
// }
//
// /**
//  * Get user data
//  * @param user_id User ID
//  * @returns Either the User or undefined if the user was not found.
//  */
// export async function getUser(user_id: string): Promise<User | undefined> {
//   const res = await fetch("http://localhost:8082/user/" + user_id);
//   const json = await res.json();
//   if ("error" in json) return undefined;
//   return json;
// }

export async function login(token: string): Promise<LoginCallback | string> {
  const res = await fetch("http://localhost:8082/login", {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: token,
    }),
  });
  const json = await res.json();
  if ("error" in json) {
    return json.error;
  }
  return json;
}

export async function logout(token: string): Promise<LogoutCallback | string> {
  const res = await fetch("http://localhost:8082/logout", {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: token,
    }),
  });
  const json = await res.json();
  if ("error" in json) {
    return json.error;
  }
  return json;
}
