import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { NewUserForm } from './new-user-form';
import { UserData } from '../../../core/models/userdata.model';

describe('NewUserForm', () => {
  let component: NewUserForm;
  let fixture: ComponentFixture<NewUserForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewUserForm],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewUserForm);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('modo criação (sem user)', () => {
    fixture.detectChanges();
    expect(component.isEditing()).toBe(false);
  });

  it('modo edição prefila o form ao abrir', () => {
    const user: UserData = {
      id: 'u1',
      fullName: 'Ana',
      birthDate: '2000-01-01',
      birthTime: '00:00',
      birthPlace: 'Floripa-SC',
    };
    fixture.componentRef.setInput('user', user);
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    expect(component.isEditing()).toBe(true);
    expect(component['createUserForm'].controls.fullName.value).toBe('Ana');
    expect(component['createUserForm'].controls.birthCity.value).toBe('Floripa');
    expect(component['createUserForm'].controls.birthUf.value).toBe('SC');
  });
});
