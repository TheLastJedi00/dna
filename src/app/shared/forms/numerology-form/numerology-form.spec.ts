import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumerologyForm } from './numerology-form';

describe('NumerologyForm', () => {
  let component: NumerologyForm;
  let fixture: ComponentFixture<NumerologyForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumerologyForm],
    }).compileComponents();

    fixture = TestBed.createComponent(NumerologyForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
