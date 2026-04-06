import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shield } from './shield';

describe('Shield', () => {
  let component: Shield;
  let fixture: ComponentFixture<Shield>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shield]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Shield);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
