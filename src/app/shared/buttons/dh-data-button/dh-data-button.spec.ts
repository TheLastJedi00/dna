import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhDataButton } from './dh-data-button';

describe('DhDataButton', () => {
  let component: DhDataButton;
  let fixture: ComponentFixture<DhDataButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DhDataButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DhDataButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
