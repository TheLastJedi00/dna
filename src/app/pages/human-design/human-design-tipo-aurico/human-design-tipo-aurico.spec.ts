import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanDesignTipoAurico } from './human-design-tipo-aurico';

describe('HumanDesignTipoAurico', () => {
  let component: HumanDesignTipoAurico;
  let fixture: ComponentFixture<HumanDesignTipoAurico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumanDesignTipoAurico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumanDesignTipoAurico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
