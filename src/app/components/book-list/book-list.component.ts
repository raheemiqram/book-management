import { Component, OnInit, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit {
  bookService = inject(BookService);
  books: Signal<Book[]> = this.bookService.books;
  nextUrl: Signal<string | null> = this.bookService.nextBooksUrl;
  previousUrl: Signal<string | null> = this.bookService.previousBooksUrl;

  ngOnInit(): void {
    this.bookService.fetchBooks();
  }

  loadNext(): void {
    if (this.nextUrl()) {
      this.bookService.fetchBooks(this.nextUrl()!);
    }
  }

  loadPrevious(): void {
    if (this.previousUrl()) {
      this.bookService.fetchBooks(this.previousUrl()!);
    }
  }
}
