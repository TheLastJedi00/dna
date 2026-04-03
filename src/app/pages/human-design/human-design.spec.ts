import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanDesign } from './human-design';

describe('HumanDesign', () => {
  let component: HumanDesign;
  let fixture: ComponentFixture<HumanDesign>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumanDesign]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumanDesign);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
