import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerHeaderMenu } from './manager-header-menu';

describe('ManagerHeaderMenu', () => {
  let component: ManagerHeaderMenu;
  let fixture: ComponentFixture<ManagerHeaderMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerHeaderMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerHeaderMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
