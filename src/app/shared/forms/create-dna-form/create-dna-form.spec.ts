import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDnaForm } from './create-dna-form';

describe('CreateDnaForm', () => {
  let component: CreateDnaForm;
  let fixture: ComponentFixture<CreateDnaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDnaForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDnaForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
