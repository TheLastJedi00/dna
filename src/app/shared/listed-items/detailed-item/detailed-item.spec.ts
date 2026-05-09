import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedItem } from './detailed-item';

describe('DetailedItem', () => {
  let component: DetailedItem;
  let fixture: ComponentFixture<DetailedItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailedItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
