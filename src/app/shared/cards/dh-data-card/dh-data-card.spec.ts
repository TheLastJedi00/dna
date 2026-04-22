import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhDataCard } from './dh-data-card';

describe('DhDataCard', () => {
  let component: DhDataCard;
  let fixture: ComponentFixture<DhDataCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DhDataCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DhDataCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
