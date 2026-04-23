import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Numerology } from './numerology';

describe('Numerology', () => {
  let component: Numerology;
  let fixture: ComponentFixture<Numerology>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Numerology]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Numerology);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
