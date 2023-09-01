export type NewBookDto = {
  title: string;
  author?: string;
  publisher?: string;
  isbn?: number;
  description?: string;
  url_img?: string;
  user_id: number;
};
