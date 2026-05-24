export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  active?: boolean;

  parent?: {
    id: string;
    name: string;
  } | null;

  children?: {
    id: string;
    name: string;
  }[];

  createdAt?: string;
  updatedAt?: string;
};