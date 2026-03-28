import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElevatedButton } from './elevated-button';

describe('ElevatedButton', () => {
  let component: ElevatedButton;
  let fixture: ComponentFixture<ElevatedButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElevatedButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElevatedButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
