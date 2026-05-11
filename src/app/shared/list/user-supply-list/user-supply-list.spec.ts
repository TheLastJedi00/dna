import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSupplyList } from './user-supply-list';

describe('UserSupplyList', () => {
  let component: UserSupplyList;
  let fixture: ComponentFixture<UserSupplyList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSupplyList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSupplyList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
