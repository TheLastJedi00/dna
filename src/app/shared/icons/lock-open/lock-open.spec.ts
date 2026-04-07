import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockOpen } from './lock-open';

describe('LockOpen', () => {
  let component: LockOpen;
  let fixture: ComponentFixture<LockOpen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LockOpen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LockOpen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
