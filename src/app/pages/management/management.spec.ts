import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { Management } from './management';

describe('Management', () => {
  let component: Management;
  let fixture: ComponentFixture<Management>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Management],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Management);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('type', 'maestras');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
