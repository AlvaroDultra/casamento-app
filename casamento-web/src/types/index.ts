export interface User {
  id: string;
  nickname: string;
  avatarUrl: string | null;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type MediaType = "IMAGE" | "VIDEO";

export interface Author {
  id: string;
  nickname: string;
  avatarUrl: string | null;
}

export interface Post {
  id: string;
  author: Author;
  caption: string | null;
  mediaUrl: string;
  mediaType: MediaType;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorNickname: string;
  authorAvatarUrl: string | null;
  content: string;
  createdAt: string;
}

// Spring Data Page
export interface Page<T> {
  content: T[];
  number: number;
  totalPages: number;
  totalElements: number;
  last: boolean;
}
