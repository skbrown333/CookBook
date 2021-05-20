import { Tag } from './Tag';
export interface Post {
  id: string;
  title: string;
  body: string;
  tags: Array<Tag>;
  character?: string;
  cre_date: Date;
  doc_ref?: any;
  doc?: any;
}
