export type UserType = {
  id: number;
  name: string;
  username: string;
  roles: string[];
  email: string;
  isAccountDisabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NewUserType = { password: string } & Omit<
  UserType,
  "id" | "createdAt" | "updatedAt" | "isAccountDisabled"
>;

export type LoginUserType = { username: string; password: string };
