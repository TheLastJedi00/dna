import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { UserSupplyList } from './user-supply-list';

describe('UserSupplyList', () => {
  let fixture: ComponentFixture<UserSupplyList>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSupplyList],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(UserSupplyList);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  const listReq = () => http.expectOne((r) => r.url.includes('/users/active/fullName/asc'));

  it('mostra skeleton e depois os usuários ativos', async () => {
    expect(fixture.nativeElement.querySelector('[aria-busy="true"]')).toBeTruthy();
    const req = listReq();
    expect(req.request.params.get('status')).toBe('active');
    req.flush([{ id: 'u1', fullName: 'Maria' }]);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Maria');
  });

  it('em erro mostra a mensagem com tentar novamente', async () => {
    listReq().error(new ProgressEvent('error'), { status: 0 });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'Sem conexão',
    );
  });
});
