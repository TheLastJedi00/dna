import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnaManagement } from './dna-management';

describe('DnaManagement', () => {
  let component: DnaManagement;
  let fixture: ComponentFixture<DnaManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DnaManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DnaManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
