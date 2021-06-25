import { Tag } from './Tag';
export interface Post {
  _id?: string;
  title: string;
  cre_account?: any;
  body: string;
  tags: Array<Tag>;
  character?: any;
  cre_date: Date;
  doc_ref?: any;
  doc?: any;
}
