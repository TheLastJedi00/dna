import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowsPointingOut } from './arrows-pointing-out';

describe('ArrowsPointingOut', () => {
  let component: ArrowsPointingOut;
  let fixture: ComponentFixture<ArrowsPointingOut>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrowsPointingOut]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowsPointingOut);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
