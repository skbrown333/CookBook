import { Post } from "./Post";
import { Tag } from "./Tag";

export interface Guide {
  _id: string;
  title: string;
  sections: Array<Post>;
  tags: Array<Tag>;
}
