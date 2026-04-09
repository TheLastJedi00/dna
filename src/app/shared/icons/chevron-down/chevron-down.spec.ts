import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChevronDown } from './chevron-down';

describe('ChevronDown', () => {
  let component: ChevronDown;
  let fixture: ComponentFixture<ChevronDown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChevronDown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChevronDown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
