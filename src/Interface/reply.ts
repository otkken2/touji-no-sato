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
  Image?:       Image;
}

export interface Image {
  data?: ImageData[] | null;
}

export interface ImageData {
  id?:         number;
  attributes?: ImageAttributes;
}

export interface ImageAttributes {
  name?:              string;
  alternativeText?:   null;
  caption?:           null;
  width?:             number;
  height?:            number;
  formats?:           Formats;
  hash?:              string;
  ext?:               string;
  mime?:              string;
  size?:              number;
  url?:               string;
  previewUrl?:        null;
  provider?:          string;
  provider_metadata?: null;
  createdAt?:         Date;
  updatedAt?:         Date;
}

export interface Formats {
  thumbnail?: Thumbnail;
}

export interface Thumbnail {
  name?:   string;
  hash?:   string;
  ext?:    string;
  mime?:   string;
  path?:   null;
  width?:  number;
  height?: number;
  size?:   number;
  url?:    string;
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



// export interface Reply {
//   data?: ReplyData[];
//   meta?: Meta;
// }

// export interface ReplyData {
//   id?:         number;
//   attributes?: ReplyAttributes;
// }

// export interface ReplyAttributes {
//   text?:        string;
//   createdAt?:   Date;
//   updatedAt?:   Date;
//   publishedAt?: Date;
//   post?:        Post;
//   user?:        User;
// }

// export interface Meta {
//   pagination?: Pagination;
// }

// export interface Pagination {
//   page?:      number;
//   pageSize?:  number;
//   pageCount?: number;
//   total?:     number;
// }
