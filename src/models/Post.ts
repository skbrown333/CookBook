import { Tag } from "./Tag";
export interface Post {
  title: string;
  body: string;
  tags: Array<Tag>;
}
