import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelCard } from './panel-card';

describe('PanelCard', () => {
  let component: PanelCard;
  let fixture: ComponentFixture<PanelCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
