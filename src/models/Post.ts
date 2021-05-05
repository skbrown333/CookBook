import { Tag } from "./Tag";
export interface Post {
  _id: string;
  title: string;
  body: string;
  tags: Array<Tag>;
}
