import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockClosed } from './lock-closed';

describe('LockClosed', () => {
  let component: LockClosed;
  let fixture: ComponentFixture<LockClosed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LockClosed]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LockClosed);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
