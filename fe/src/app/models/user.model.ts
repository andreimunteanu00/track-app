export interface IUser {
  username?: string | undefined | null;
  password?: string | undefined | null;
}

export class User implements IUser {
  constructor(
    public username?: string | undefined | null,
    public password?: string | undefined | null
  ) {}
}

