export interface Book {
    id: number;
    title: string;
    year: number;
    author: string;
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



export class FavoriteBookList {
    id?: number;
    name: string;
    books: Book[];
    selectedBooks: { [key: number]: boolean } = {};

    constructor(id: number, name: string, books: Book[], selectedBooks: {}) {
        this.id = id
        this.name = name;
        this.books = books;
        this.selectedBooks = selectedBooks;
    }
}