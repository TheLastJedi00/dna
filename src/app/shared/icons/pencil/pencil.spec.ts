import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pencil } from './pencil';

describe('Pencil', () => {
  let component: Pencil;
  let fixture: ComponentFixture<Pencil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pencil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pencil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
