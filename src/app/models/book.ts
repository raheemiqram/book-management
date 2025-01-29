export interface Book {
    id: number;
    title: string;
    year: number;
    auther: string;
  }
  
export class FavoriteBook {
    id?: number;
    name: string;
    books: number[];
  
    constructor(name: string, books: number[]) {
      this.name = name;
      this.books = books;
    }
  }
  