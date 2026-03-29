import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgImageCard } from './bg-image-card';

describe('BgImageCard', () => {
  let component: BgImageCard;
  let fixture: ComponentFixture<BgImageCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BgImageCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BgImageCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
