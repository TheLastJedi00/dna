import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { Supply, Topic } from '../models/supply.model';

/**
 * Junta os tópicos de um ou mais módulos de supply, buscados em paralelo.
 *
 * Módulo que responde **404 ainda não foi gerado** e é só pulado — se nenhum
 * existir, a lista volta vazia e a tela mostra "ainda não disponível". Qualquer
 * outra falha (rede, 5xx, permissão) **propaga**, para a tela mostrar o erro
 * com "Tentar novamente" em vez de fingir que o conteúdo não existe.
 */
export async function fetchSupplyTopics(
  requests: Array<() => Observable<Supply>>,
): Promise<Topic[]> {
  const supplies = await Promise.all(
    requests.map((request) =>
      firstValueFrom(request()).catch((e) => {
        if (e instanceof HttpErrorResponse && e.status === 404) return null;
        throw e;
      }),
    ),
  );
  return supplies.flatMap((s) => s?.topics ?? []);
}
