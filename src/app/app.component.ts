import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookListComponent } from './components/book-list/book-list.component';
import { FavoriteBookListComponent } from './components/favorite-book-list/favorite-book-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BookListComponent, FavoriteBookListComponent],
  template: `
    <app-book-list></app-book-list>
    <app-favorite-book-list></app-favorite-book-list>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
