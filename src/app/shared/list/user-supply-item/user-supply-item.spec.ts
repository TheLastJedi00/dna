import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSupplyItem } from './user-supply-item';

describe('UserSupplyItem', () => {
  let component: UserSupplyItem;
  let fixture: ComponentFixture<UserSupplyItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSupplyItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSupplyItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
