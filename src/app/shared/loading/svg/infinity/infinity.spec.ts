import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Infinity } from './infinity';

describe('Infinity', () => {
  let component: Infinity;
  let fixture: ComponentFixture<Infinity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Infinity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Infinity);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
