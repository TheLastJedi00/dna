import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListsCardGrid } from './lists-card-grid';

describe('ListsCardGrid', () => {
  let component: ListsCardGrid;
  let fixture: ComponentFixture<ListsCardGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListsCardGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListsCardGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
