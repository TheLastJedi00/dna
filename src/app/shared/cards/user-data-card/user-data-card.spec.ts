import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDataCard } from './user-data-card';

describe('UserDataCard', () => {
  let component: UserDataCard;
  let fixture: ComponentFixture<UserDataCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDataCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDataCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
