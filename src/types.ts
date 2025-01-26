export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  category: Category;
  coverImage: string;
  content: string;
  publishDate: string;
  tags: string[];
}

export type Category = 'Yazı' | 'Şiir' | 'Anı' | 'Deneme';

export interface BlogCardProps {
  post: BlogPost;
}

export interface FilterOptions {
  category?: Category;
  sortBy: 'newest' | 'oldest';
  searchTags: string[];
}