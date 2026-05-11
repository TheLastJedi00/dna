import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSupplyDetails } from './user-supply-details';

describe('UserSupplyDetails', () => {
  let component: UserSupplyDetails;
  let fixture: ComponentFixture<UserSupplyDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSupplyDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSupplyDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
