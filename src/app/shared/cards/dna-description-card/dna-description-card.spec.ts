import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnaDescriptionCard } from './dna-description-card';

describe('DnaDescriptionCard', () => {
  let component: DnaDescriptionCard;
  let fixture: ComponentFixture<DnaDescriptionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DnaDescriptionCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DnaDescriptionCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
