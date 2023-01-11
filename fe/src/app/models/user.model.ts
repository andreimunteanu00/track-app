export interface IUser {
  username?: string;
}

// @ts-ignore
export class User implements IUser {
  constructor(
    public username?: number
  ) {}
}

