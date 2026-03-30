import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHeaderMenu } from './user-header-menu';

describe('UserHeaderMenu', () => {
  let component: UserHeaderMenu;
  let fixture: ComponentFixture<UserHeaderMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserHeaderMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserHeaderMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
