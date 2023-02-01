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
}

export interface Post{
  id: number;
  Image?: Image[];
  description: string;
  createdAt?: string;
  locale?: string; 
  publishedAt?: string;
  updatedAt?: string;
  ryokan?: string;
}

export interface Image{
  alternativeText?: string | null;
  caption?: string | null
  createdAt?: string;
  ext?: string;
  formats?: any;
  hash?: string;
  height?: number;
  id?: number;
  mime?: string;
  name: string;
  previewUrl?: string | null;
  provider?: string;
  provider_metadata?: any | null
  size?: number;
  updatedAt?: string; 
  url: string; 
  width?: number;
  }

export interface Role{
  createdAt?: string;
  description?: string;
  id?: number;
  name?: string;
  type?: string;
  updatedAt?: string;
}