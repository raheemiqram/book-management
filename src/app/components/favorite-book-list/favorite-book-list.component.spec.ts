import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteBookListComponent } from './favorite-book-list.component';

describe('FavoriteBookListComponent', () => {
  let component: FavoriteBookListComponent;
  let fixture: ComponentFixture<FavoriteBookListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteBookListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteBookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
