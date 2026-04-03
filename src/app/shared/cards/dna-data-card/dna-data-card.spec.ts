import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnaDataCard } from './dna-data-card';

describe('DnaDataCard', () => {
  let component: DnaDataCard;
  let fixture: ComponentFixture<DnaDataCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DnaDataCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DnaDataCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
