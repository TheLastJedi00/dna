import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Encarnacao } from './encarnacao';

describe('Encarnacao', () => {
  let component: Encarnacao;
  let fixture: ComponentFixture<Encarnacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Encarnacao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Encarnacao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
