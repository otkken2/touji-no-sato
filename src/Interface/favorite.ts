import { User, Post } from "./interfaces";

export interface Favorite {
  data?: FavoriteData[];
  meta?: Meta;
}

export interface FavoriteData{
  id?:         number;
  attributes?: FavoriteAttributes;
}

export interface FavoriteAttributes {
  createdAt?:   Date;
  updatedAt?:   Date;
  publishedAt?: Date;
  user?:        User;
  post?:        Post;
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
