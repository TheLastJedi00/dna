import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPanelFooter } from './user-panel-footer';

describe('UserPanelFooter', () => {
  let component: UserPanelFooter;
  let fixture: ComponentFixture<UserPanelFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPanelFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPanelFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
