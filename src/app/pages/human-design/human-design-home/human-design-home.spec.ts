import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanDesignHome } from './human-design-home';

describe('HumanDesignHome', () => {
  let component: HumanDesignHome;
  let fixture: ComponentFixture<HumanDesignHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumanDesignHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumanDesignHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
