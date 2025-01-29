import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Book, FavoriteBook, FavoriteBookList } from '../models/book';
import { Signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = `${environment.apiBaseUrl}/books/`;
  private favoriteBooksUrl = `${environment.apiBaseUrl}/book-lists/`;

  books = signal<Book[]>([]);
  nextBooksUrl = signal<string | null>(null);
  previousBooksUrl = signal<string | null>(null);

  favoriteBooks = signal<FavoriteBook[]>([]);
  favoriteBooksList = signal<FavoriteBookList[]>([]);
  nextFavBooksUrl = signal<string | null>(null);
  previousFavBooksUrl = signal<string | null>(null);

  constructor(private http: HttpClient) { }

  fetchBooks(url: string = this.apiUrl): void {
    this.http
      .get<{ count: number; next: string | null; previous: string | null; results: Book[] }>(url)
      .subscribe((response) => {
        this.books.set(response.results);
        this.nextBooksUrl.set(response.next);
        this.previousBooksUrl.set(response.previous);
      });
  }

  fetchFavoriteBooks(url: string = this.favoriteBooksUrl): void {
    this.http
      .get<{ count: number; next: string | null; previous: string | null; results: any[] }>(url)
      .subscribe((response) => {
        const transformedFavoriteBooks = response.results.map((favBook) => {
          const books = favBook.books.map((book: any) => {
            return {
              id: book.id,
              title: book.title,
              year: book.year,
              auther: book.auther
            };
          });

          return new FavoriteBookList(favBook.id, favBook.name, books, {});
        });

        this.favoriteBooksList.set(transformedFavoriteBooks);
        this.nextFavBooksUrl.set(response.next);
        this.previousFavBooksUrl.set(response.previous);
      });
  }


  addFavoriteBook(favoriteBook: FavoriteBook): void {
    this.http.post<FavoriteBook>(this.favoriteBooksUrl, favoriteBook).subscribe(() => {
      this.fetchFavoriteBooks();
    });
  }

  updateFavoriteBook(favoriteBook: FavoriteBook): void {
    this.http
      .put<FavoriteBook>(`${this.favoriteBooksUrl}${favoriteBook.id}/`, favoriteBook)
      .subscribe(() => {
        this.fetchFavoriteBooks();
      });
  }

  removeFavoriteBook(id: number): void {
    this.http.delete(`${this.favoriteBooksUrl}${id}/`).subscribe(() => {
      this.favoriteBooks.set(this.favoriteBooks().filter((fav) => fav.id !== id));
    });
  }
}
