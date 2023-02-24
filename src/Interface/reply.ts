import { Post, User } from "./interfaces";

export interface Reply {
  data?: ReplyData[];
  meta?: Meta;
}

export interface ReplyData {
  id?:         number;
  attributes?: ReplyAttributes;
}

export interface ReplyAttributes {
  text?:        string;
  createdAt?:   Date;
  updatedAt?:   Date;
  publishedAt?: Date;
  post?:        Post;
  user?:        User;
}

export interface Meta {
  pagination?: Pagination;
}

export interface Pagination {
  page?:      number;
  pageSize?:  number;
  pageCount?: number;
  total?:     number;
}
