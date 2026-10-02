export interface Book {
  _id: string;

  title: string;

  author: string;

  category: string;

  isbn: string;

  quantity: number;

  available: number;

  createdAt?: string;

  updatedAt?: string;
}