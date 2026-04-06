import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconsSwitch } from './icons-switch';

describe('IconsSwitch', () => {
  let component: IconsSwitch;
  let fixture: ComponentFixture<IconsSwitch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconsSwitch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconsSwitch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
