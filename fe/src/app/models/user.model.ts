export interface IUser {
  email?: string | undefined | null;
  password?: string | undefined | null;
}

export class User implements IUser {
  constructor(
    public email?: string | undefined | null,
    public password?: string | undefined | null
  ) {}
}

