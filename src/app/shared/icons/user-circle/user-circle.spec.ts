import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCircle } from './user-circle';

describe('UserCircle', () => {
  let component: UserCircle;
  let fixture: ComponentFixture<UserCircle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCircle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCircle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
