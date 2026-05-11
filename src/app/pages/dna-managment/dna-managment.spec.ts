import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnaManagment } from './dna-managment';

describe('DnaManagment', () => {
  let component: DnaManagment;
  let fixture: ComponentFixture<DnaManagment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DnaManagment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DnaManagment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
