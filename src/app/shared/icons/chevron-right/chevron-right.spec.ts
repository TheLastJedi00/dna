import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChevronRight } from './chevron-right';

describe('ChevronRight', () => {
  let component: ChevronRight;
  let fixture: ComponentFixture<ChevronRight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChevronRight]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChevronRight);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
