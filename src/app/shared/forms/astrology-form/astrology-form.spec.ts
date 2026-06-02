import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AstrologyForm } from './astrology-form';

describe('AstrologyForm', () => {
  let component: AstrologyForm;
  let fixture: ComponentFixture<AstrologyForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AstrologyForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AstrologyForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
