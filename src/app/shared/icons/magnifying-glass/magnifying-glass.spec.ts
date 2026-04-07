import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagnifyingGlass } from './magnifying-glass';

describe('MagnifyingGlass', () => {
  let component: MagnifyingGlass;
  let fixture: ComponentFixture<MagnifyingGlass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MagnifyingGlass]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MagnifyingGlass);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
