import { Component, ElementRef, OnInit, Signal, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BookService } from '../../services/book.service';
import { FavoriteBook, Book, FavoriteBookList } from '../../models/book';
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
  favoriteBooks: Signal<FavoriteBookList[]> = this.bookService.favoriteBooksList;
  books: Signal<Book[]> = this.bookService.books;
  nextFavBooksUrl: Signal<string | null> = this.bookService.nextFavBooksUrl;
  previousFavBooksUrl: Signal<string | null> = this.bookService.previousFavBooksUrl;
  newListName: string = '';

  @ViewChild('bookSelectModal') bookSelectModal!: ElementRef;

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

  removeBookFromFavorite(favBookList: FavoriteBookList, bookId: number): void {

    const bookIds = favBookList.books.map((book: Book) => book.id);
    const bookIndex = bookIds.indexOf(bookId);

    if (bookIndex > -1) {
      bookIds.splice(bookIndex, 1);

      const updatedFavBook: FavoriteBook = {
        id: favBookList.id,
        name: favBookList.name,
        books: bookIds,
      };
      this.bookService.updateFavoriteBook(updatedFavBook)
      this.fetchPreviousFavoriteBooks()
    }
  }

  saveSelectedBooks(favBook: FavoriteBookList): void {

    if (!favBook.selectedBooks) {
      return; // Prevents errors if selectedBooks is undefined
    }

    const selectedBookIds = Object.keys(favBook.selectedBooks)
      .filter((key) => favBook.selectedBooks[+key])
      .map(Number);

    const existingBookIds = favBook.books.map((book: Book) => book.id);
    const updatedBookIds = Array.from(new Set([...existingBookIds, ...selectedBookIds]));


    const updatedFavBook: FavoriteBook = {
      id: favBook.id,
      name: favBook.name,
      books: updatedBookIds,
    };
    this.bookService.updateFavoriteBook(updatedFavBook)
    this.fetchPreviousFavoriteBooks()
  }
}