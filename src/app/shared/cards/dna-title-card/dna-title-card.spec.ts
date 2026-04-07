import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnaTitleCard } from './dna-title-card';

describe('DnaTitleCard', () => {
  let component: DnaTitleCard;
  let fixture: ComponentFixture<DnaTitleCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DnaTitleCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DnaTitleCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
