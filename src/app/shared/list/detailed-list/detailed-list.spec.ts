import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedList } from './detailed-list';

describe('DetailedList', () => {
  let component: DetailedList;
  let fixture: ComponentFixture<DetailedList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailedList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
