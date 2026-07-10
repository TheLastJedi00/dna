import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardButton } from './dashboard-button';

describe('DashboardButton', () => {
  let component: DashboardButton;
  let fixture: ComponentFixture<DashboardButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardButton],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardButton);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('renderiza <img> quando icon não é informado (retrocompat)', () => {
    fixture.componentRef.setInput('imgSrc', 'http://x/y.png');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('img')).toBeTruthy();
    expect(el.querySelector('app-icons-switch')).toBeFalsy();
  });

  it('renderiza SVG (app-icons-switch) quando icon é informado', () => {
    fixture.componentRef.setInput('icon', 'users');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-icons-switch')).toBeTruthy();
    expect(el.querySelector('img')).toBeFalsy();
  });

  it('emite action no clique', () => {
    let emitted = false;
    component.action.subscribe(() => (emitted = true));
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    expect(emitted).toBe(true);
  });
});
