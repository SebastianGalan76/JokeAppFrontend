import { JokeDto } from "./JokeDto";

export class JokeList {
  constructor(
    public id: number,
    public name: string,
    public uuid: string,
    public visibilityType: JokeListVisibilityEnum,
    public jokes: JokeDto[]
  ) { }
}

export enum JokeListVisibilityEnum {
  PUBLIC = 'PUBLIC', 
  NOT_PUBLIC = 'NOT_PUBLIC', 
  PRIVATE = 'PRIVATE'
}