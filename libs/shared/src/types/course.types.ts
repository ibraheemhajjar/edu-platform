export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  author: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCourseInput {
  title: string;
  description: string;
  price: number;
  author: string;
  published: boolean;
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
  price?: number;
  author?: string;
  published?: boolean;
}
