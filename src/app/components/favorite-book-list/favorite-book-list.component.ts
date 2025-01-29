import { Component, OnInit, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BookService } from '../../services/book.service';
import { FavoriteBook, Book } from '../../models/book';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-favorite-book-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './favorite-book-list.component.html',
  styleUrls: ['./favorite-book-list.component.scss'],
})
export class FavoriteBookListComponent implements OnInit {
  bookService = inject(BookService);
  favoriteBooks: Signal<FavoriteBook[]> = this.bookService.favoriteBooks;
  books: Signal<Book[]> = this.bookService.books;
  nextFavBooksUrl: Signal<string | null> = this.bookService.nextFavBooksUrl;
  previousFavBooksUrl: Signal<string | null> = this.bookService.previousFavBooksUrl;
  newListName: string = '';
  selectedBookId: number | null = null;

  ngOnInit(): void {
    this.bookService.fetchFavoriteBooks();
    this.bookService.fetchBooks();
  }

  fetchNextFavoriteBooks(): void {
    if (this.nextFavBooksUrl()) {
      this.bookService.fetchFavoriteBooks(this.nextFavBooksUrl()!);
    }
  }

  fetchPreviousFavoriteBooks(): void {
    if (this.previousFavBooksUrl()) {
      this.bookService.fetchFavoriteBooks(this.previousFavBooksUrl()!);
    }
  }

  createFavoriteBookList(): void {
    if (!this.newListName.trim()) return;
    const newFavList = new FavoriteBook(this.newListName, []);
    this.bookService.addFavoriteBook(newFavList);
    this.newListName = '';
  }

  removeFavoriteBook(id: number): void {
    this.bookService.removeFavoriteBook(id);
  }

  addBookToFavorite(favBook: FavoriteBook): void {
    if (!this.selectedBookId) return;

    if (!favBook.books.includes(this.selectedBookId)) {
      favBook.books.push(this.selectedBookId);
      this.bookService.updateFavoriteBook(favBook);
    }
  }

  removeBookFromFavorite(favBook: FavoriteBook, bookId: number): void {
    favBook.books = favBook.books.filter((id) => id !== bookId);
    this.bookService.updateFavoriteBook(favBook);
  }
}
