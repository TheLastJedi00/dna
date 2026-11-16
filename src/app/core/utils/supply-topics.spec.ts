import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Supply } from '../models/supply.model';
import { fetchSupplyTopics } from './supply-topics';

const supply = (title: string) => ({ topics: [{ title }] }) as unknown as Supply;

describe('fetchSupplyTopics', () => {
  it('junta os tópicos e pula módulo ainda não gerado (404)', async () => {
    const topics = await fetchSupplyTopics([
      () => of(supply('a')),
      () => throwError(() => new HttpErrorResponse({ status: 404 })),
      () => of(supply('b')),
    ]);
    expect(topics.map((t: any) => t.title)).toEqual(['a', 'b']);
  });

  it('propaga falha que não é 404', async () => {
    await expectAsync(
      fetchSupplyTopics([
        () => of(supply('a')),
        () => throwError(() => new HttpErrorResponse({ status: 0 })),
      ]),
    ).toBeRejected();
  });
});
