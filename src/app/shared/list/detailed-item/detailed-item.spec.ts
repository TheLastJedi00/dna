import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { DetailedItem } from './detailed-item';
import { UserData } from '../../../core/models/userdata.model';

const MAESTRA: UserData = {
  id: 'u1',
  fullName: 'Ana',
  birthDate: '2000-01-01',
  birthTime: '00:00',
  birthPlace: 'Floripa-SC',
  isActive: true,
};

describe('DetailedItem', () => {
  let component: DetailedItem;
  let fixture: ComponentFixture<DetailedItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailedItem],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailedItem);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', MAESTRA);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('exibe selo "Ativa" para maestra ativa', () => {
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Ativa');
  });

  it('exibe selo "Inativa" quando isActive é false', () => {
    fixture.componentRef.setInput('data', { ...MAESTRA, isActive: false });
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Inativa',
    );
  });
});
