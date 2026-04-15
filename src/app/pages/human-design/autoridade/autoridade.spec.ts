import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Autoridade } from './autoridade';

describe('Autoridade', () => {
  let component: Autoridade;
  let fixture: ComponentFixture<Autoridade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Autoridade]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Autoridade);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
