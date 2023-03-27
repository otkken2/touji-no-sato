export interface UserInterface{
  id: number;
  username: string;
  email: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  posts?: Post[];
  role?: Role;
  selfIntroduction?: string;
  profileIcon?: string;
}

export interface ProfileIcon {
  data: ProfileIconData;
}

export interface ProfileIconData {
  id?:         number;
  attributes?: ProfileIconAttributes;
}

export interface ProfileIconAttributes {
  name?:              string;
  alternativeText?:   string;
  caption?:           null;
  width?:             number | null;
  height?:            number | null;
  formats?:           Formats | null;
  hash?:              string;
  ext?:               EXT;
  mime?:              MIME;
  size?:              number;
  url?:               string;
  previewUrl?:        string;
  provider?:          string;
  provider_metadata?: null;
  createdAt?:         Date;
  updatedAt?:         Date;
}

export type MIME = "image/png" | "image/jpeg" | "video/quicktime";
export type EXT = ".jpeg" | ".png" | ".mov";

export interface Role{
  createdAt?: string;
  description?: string;
  id?: number;
  name?: string;
  type?: string;
  updatedAt?: string;
}


// ↓新規追加。
export interface Post {
  data?: PostData;
  meta?: Meta;
}

export interface PostData {
  id?:         number;
  attributes?: PostAttributes;
}

export interface PostAttributes {
  description?:   string;
  createdAt?:     Date;
  updatedAt?:     Date;
  publishedAt?:   Date;
  locale?:        string;
  ryokan?:        string;
  favoriteCount?: number;
  Image?:         Images;
  user?:          User;
  localizations?: Images;
  parentPostId?:  number;
  bathingDay?:    Date;
  lat?:           number;
  lng?:           number;
}

export interface Images {
  data?: Image[];
}

export interface Image {
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

export interface User {
  data?: UserData;
}

export interface UserData {
  id?:         number;
  attributes?: UserInterface;
}


export interface Meta {
}

export interface PreviewFilesInterface{
  URL: string,
  isMovie: boolean
}

