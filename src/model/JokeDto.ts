import { Category } from "./Category";
import { User } from "./User";

export interface JokeDto {
  id: number;
  content: string;
  charCount: number;
  status: string;
  type: string,
  kind: string,
  categories: Category[];
  owner: User;
  createdAt: string;
  userRating: number;
  likeAmount: number;
  dislikeAmount: number;
  jokeLists: any | null;
  favorite: boolean;
}