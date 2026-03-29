import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatButton } from './flat-button';

describe('FlatButton', () => {
  let component: FlatButton;
  let fixture: ComponentFixture<FlatButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlatButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
