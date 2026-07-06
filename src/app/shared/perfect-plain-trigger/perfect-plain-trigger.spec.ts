import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { PerfectPlainTrigger } from './perfect-plain-trigger';
import { SupplyService } from '../../core/services/supply.service';
import { DnaStatusService } from '../../core/services/dna-status.service';

describe('PerfectPlainTrigger', () => {
  let supply: {
    isSupplyForThisUser: jasmine.Spy;
    createFullPillar: jasmine.Spy;
  };
  let dna: { getStatusByUserId: jasmine.Spy };
  let router: jasmine.SpyObj<Router>;

  const status = (hd: boolean, num: boolean, astro: boolean) =>
    of({ human_design: hd, numerology: num, astrology: astro });

  async function build(hd: boolean, num: boolean, astro: boolean, created = false) {
    supply = {
      isSupplyForThisUser: jasmine.createSpy().and.returnValue(of(created)),
      createFullPillar: jasmine.createSpy().and.returnValue(of([])),
    };
    dna = {
      getStatusByUserId: jasmine.createSpy().and.returnValue(status(hd, num, astro)),
    };
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [PerfectPlainTrigger],
      providers: [
        provideZonelessChangeDetection(),
        { provide: SupplyService, useValue: supply },
        { provide: DnaStatusService, useValue: dna },
        { provide: Router, useValue: router },
      ],
    });
    TestBed.overrideComponent(PerfectPlainTrigger, {
      set: { template: '', imports: [] },
    });
    const fixture = TestBed.createComponent(PerfectPlainTrigger);
    fixture.componentRef.setInput('maestraId', 'u1');
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture.componentInstance;
  }

  it('habilita (ready) quando os 3 pilares existem', async () => {
    const cmp = await build(true, true, true);
    expect(cmp.ready()).toBeTrue();
  });

  it('não habilita se faltar um pilar', async () => {
    const cmp = await build(true, false, true);
    expect(cmp.ready()).toBeFalse();
    expect(supply.isSupplyForThisUser).not.toHaveBeenCalled();
  });

  it('generate chama createFullPillar("perfect-plain", ...)', async () => {
    const cmp = await build(true, true, true);
    await cmp.generate();
    expect(supply.createFullPillar).toHaveBeenCalledWith('perfect-plain', 'u1');
  });

  it('view navega para /perfect-plain/:userId', async () => {
    const cmp = await build(true, true, true);
    cmp.view();
    expect(router.navigate).toHaveBeenCalledWith(['perfect-plain', 'u1']);
  });
});
