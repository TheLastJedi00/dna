import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalAccordion } from './vertical-accordion';

describe('VerticalAccordion', () => {
  let component: VerticalAccordion;
  let fixture: ComponentFixture<VerticalAccordion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalAccordion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerticalAccordion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
