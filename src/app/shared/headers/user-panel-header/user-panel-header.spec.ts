import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPanelHeader } from './user-panel-header';

describe('UserPanelHeader', () => {
  let component: UserPanelHeader;
  let fixture: ComponentFixture<UserPanelHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPanelHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPanelHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
