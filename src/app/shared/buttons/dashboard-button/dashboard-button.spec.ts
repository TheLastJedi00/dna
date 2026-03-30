import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardButton } from './dashboard-button';

describe('DashboardButton', () => {
  let component: DashboardButton;
  let fixture: ComponentFixture<DashboardButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
