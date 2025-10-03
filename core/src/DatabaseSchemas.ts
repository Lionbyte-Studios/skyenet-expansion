/*export interface User {
  user_id: string;
  username: string;
  email: string;
  password: string;
  bio: string;
  statistics: UserStatistics;
  achievements: Achievement[];
}*/

export interface User {
  id: string;
  discord: {
    user_id: string;
    username: string;
    avatar: string;
    email: string;
    global_name: string;
  };
}

export interface Session {
  token: string;
  discord_session: {
    access_token: string;
    expires_in: number;
    token_type: string;
    refresh_token: string;
    scope: string;
  };
  discord_user: {
    user_id: string;
    username: string;
    avatar: string;
    email: string;
    global_name: string;
  };
  // id
  associated_user: string;
  created_at: number;
}

export type UserWithOptionalPassword = Omit<User, "password"> & {
  password?: string;
};
export type UserWithoutPassword = Omit<User, "password">;

export interface UserStatistics {
  timesJoinedGame: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
}
/*
export interface Session {
  session_id: number;
  token: string;
  user_id: string;
  // Timestamp
  created_at: number;
  // Timestamp
  expires: number;
}
*/
