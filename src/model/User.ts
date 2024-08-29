import { JokeList } from "./JokeList";

export class User {
  constructor(
    public login: string,
    public email: string,
    public role: UserRoleEnum,
    public jokeLists: JokeList[]
  ) {}

  
}

export enum UserRoleEnum {
  USER, HELPER, MODERATOR, ADMIN
}

