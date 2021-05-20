import { Tag } from './Tag';
export interface Post {
  id: string;
  title: string;
  body: string;
  tags: Array<Tag>;
  doc_ref?: any;
}
