import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AstrologyHome } from './astrology-home';

describe('AstrologyHome', () => {
  let component: AstrologyHome;
  let fixture: ComponentFixture<AstrologyHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AstrologyHome],
    }).compileComponents();

    fixture = TestBed.createComponent(AstrologyHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
