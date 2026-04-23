import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumDataButton } from './num-data-button';

describe('NumDataButton', () => {
  let component: NumDataButton;
  let fixture: ComponentFixture<NumDataButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumDataButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumDataButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
