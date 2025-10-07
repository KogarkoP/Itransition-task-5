export type User = {
  id: string;
  name: string;
  email: string;
  terms_privacy: boolean;
  isVerified: boolean;
  isBlocked: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type UserInsert = {
  name: string;
  email: string;
  password: string;
  terms_privacy: boolean;
};

export type UpdateUsers = {
  usersIds: string[];
  update: Record<string, boolean>;
};
