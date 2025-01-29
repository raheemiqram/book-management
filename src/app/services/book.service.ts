import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Book, FavoriteBook } from '../models/book';
import { Signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = `${environment.apiBaseUrl}/books/`;
  private favoriteBooksUrl = `${environment.apiBaseUrl}/book-list/`;

  books = signal<Book[]>([]);
  nextBooksUrl = signal<string | null>(null);
  previousBooksUrl = signal<string | null>(null);

  favoriteBooks = signal<FavoriteBook[]>([]);
  nextFavBooksUrl = signal<string | null>(null);
  previousFavBooksUrl = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  /** Fetch books with pagination */
  fetchBooks(url: string = this.apiUrl): void {
    this.http
      .get<{ count: number; next: string | null; previous: string | null; results: Book[] }>(url)
      .subscribe((response) => {
        this.books.set(response.results);
        this.nextBooksUrl.set(response.next);
        this.previousBooksUrl.set(response.previous);
      });
  }

  /** Fetch paginated favorite books */
  fetchFavoriteBooks(url: string = this.favoriteBooksUrl): void {
    this.http
      .get<{ count: number; next: string | null; previous: string | null; results: FavoriteBook[] }>(url)
      .subscribe((response) => {
        this.favoriteBooks.set(response.results);
        this.nextFavBooksUrl.set(response.next);
        this.previousFavBooksUrl.set(response.previous);
      });
  }

  /** Add a new favorite book list */
  addFavoriteBook(favoriteBook: FavoriteBook): void {
    this.http.post<FavoriteBook>(this.favoriteBooksUrl, favoriteBook).subscribe(() => {
      this.fetchFavoriteBooks();
    });
  }

  /** Update a favorite book list */
  updateFavoriteBook(favoriteBook: FavoriteBook): void {
    this.http
      .put<FavoriteBook>(`${this.favoriteBooksUrl}${favoriteBook.id}/`, favoriteBook)
      .subscribe(() => {
        this.fetchFavoriteBooks();
      });
  }

  /** Remove a favorite book list */
  removeFavoriteBook(id: number): void {
    this.http.delete(`${this.favoriteBooksUrl}${id}/`).subscribe(() => {
      this.favoriteBooks.set(this.favoriteBooks().filter((fav) => fav.id !== id));
    });
  }
}
