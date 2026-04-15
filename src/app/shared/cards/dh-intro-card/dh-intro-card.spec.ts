import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhIntroCard } from './dh-intro-card';

describe('DhIntroCard', () => {
  let component: DhIntroCard;
  let fixture: ComponentFixture<DhIntroCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DhIntroCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DhIntroCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
