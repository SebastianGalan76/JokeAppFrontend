export class User {
  constructor(
    public login: string,
    public email: string,
    public role: UserRoleEnum
  ) {}

  
}

export enum UserRoleEnum {
  USER, HELPER, MODERATOR, ADMIN
}