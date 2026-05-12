import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanDesignForm } from './human-design-form';

describe('HumanDesignForm', () => {
  let component: HumanDesignForm;
  let fixture: ComponentFixture<HumanDesignForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumanDesignForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumanDesignForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
