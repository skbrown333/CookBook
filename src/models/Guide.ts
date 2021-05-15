import { Post } from "./Post";
import { Tag } from "./Tag";

export interface Guide {
  id?: string;
  title: string;
  sections: Array<Post>;
  tags: Array<Tag>;
  character: string | null;
  description?: string;
  doc_ref?: any;
}
