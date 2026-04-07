import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowsRightLeft } from './arrows-right-left';

describe('ArrowsRightLeft', () => {
  let component: ArrowsRightLeft;
  let fixture: ComponentFixture<ArrowsRightLeft>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrowsRightLeft]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowsRightLeft);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
