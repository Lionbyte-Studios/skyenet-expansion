export interface User {
  user_id: string;
  username: string;
  email: string;
  password: string;
  bio: string;
  statistics: UserStatistics;
  achievements: Achievement[];
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

export enum ErrorType {
    UsernameIsNotString,
    EmailIsNotString,
    PasswordIsNotString,
    UsernameTooShort,
    UsernameAlreadyExists,
}