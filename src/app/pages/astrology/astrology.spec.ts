import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Astrology } from './astrology';

describe('Astrology', () => {
  let component: Astrology;
  let fixture: ComponentFixture<Astrology>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Astrology],
    }).compileComponents();

    fixture = TestBed.createComponent(Astrology);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
