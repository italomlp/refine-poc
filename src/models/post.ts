import { ICategory } from '@/models/category';

export interface IPost {
  id: string;
  title: string;
  status: 'published' | 'draft' | 'rejected';
  createdAt: string;
  category: ICategory;
  content: string;
}
