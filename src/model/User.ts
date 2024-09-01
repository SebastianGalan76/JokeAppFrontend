import { JokeList } from "./JokeList";

export class User {
  constructor(
    public id: number,
    public login: string,
    public email: string,
    public role: UserRoleEnum,
    public jokeLists: JokeList[]
  ) {}

  
}

export enum UserRoleEnum {
  USER=0, HELPER=500, MODERATOR=2000, ADMIN=10000
}

