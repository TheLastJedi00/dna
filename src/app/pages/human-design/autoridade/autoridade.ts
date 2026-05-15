import { Component, inject, OnInit, signal } from '@angular/core';
import { DhIntroCard } from '../../../shared/cards/dh-intro-card/dh-intro-card';
import { VerticalAccordion } from '../../../shared/accordions/vertical-accordion/vertical-accordion';
import { ListsCardGrid } from '../../../shared/grid/lists-card-grid/lists-card-grid';
import { SupplyService } from '../../../core/services/supply.service';
import { Topic } from '../../../core/models/supply.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-autoridade',
  imports: [DhIntroCard, VerticalAccordion, ListsCardGrid],
  templateUrl: './autoridade.html',
  styleUrl: './autoridade.scss',
})
export class Autoridade implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly supplyService = inject(SupplyService);

  readonly userId = signal('');
  topics = signal<Topic[] | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const userId = this.route.snapshot.parent!.paramMap.get('userId') ?? '';
    this.userId.set(userId);

    this.supplyService.getHumanDesignModule(userId, 'autoridade').subscribe({
      next: (supply) => {
        this.topics.set(supply.topics);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Conteúdo ainda não disponível.');
        this.isLoading.set(false);
      },
    });
  }

  intro = signal([
    'Dentro do Desenho Humano, a Autoridade representa o seu centro interno de tomada de decisão, o lugar da sua energia (não da mente) onde mora a sua verdade.',
    'Quando você toma decisões a partir da sua Autoridade, você age em alinhamento com a sua energia, e a vida começa a fluir com menos resistência.',
    'Quando você ignora sua Autoridade Interna e decide com base em pressões externas, medos ou mente racional, geralmente o resultado é desconforto, frustração ou arrependimento.',
    'É importante entender que, segundo o Desenho Humano, a mente nunca deve ser usada para tomar decisões pessoais. Ela é ótima para observar, aprender, ensinar, planejar e comunicar — mas quando colocamos a mente no trono das decisões, acabamos nos desconectando da nossa sabedoria corporal.',
    'Cada pessoa tem uma Autoridade específica, baseada na configuração dos seus centros energéticos.',
    'Isso quer dizer que não existe uma fórmula universal: cada corpo tem um tipo de sabedoria própria, e é isso que torna cada jornada tão única.',
  ]);

  tiposAutoridade = signal(
    `<p><b>Plexo Solar / Emocional:</b> Decisões devem ser feitas após o tempo necessário para ganhar clareza emocional. Não decida no calor da emoção.</p>
  <p><b>Sacral:</b> A decisão é sentida no corpo, de forma instintiva e imediata. Se for um "aham", vá. Se for um "não sei", espere.</p>
  <p><b>Esplênica:</b> A decisão vem como um sussurro intuitivo e rápido. Confie no primeiro impulso corporal.</p>
  <p><b>Ego (Centro do Coração):</b> A decisão correta é aquela que afirma seu valor pessoal e desejo genuíno.</p>
  <p><b>Auto-Projetada:</b> Você acessa sua verdade ao escutar a si mesma falando. Decisões vêm pela verbalização do que ressoa.</p>
  <p><b>Caixa de Ressonância / Mental / Ambiental:</b> Mais comum em Projetores com Centro Ajna definido e Centro da Autoridade indefinido. A decisão se dá ao falar com outras pessoas e observar como certas ideias ressoam no ambiente.</p>
  <p><b>Ciclo Lunar (Refletores):</b> As decisões devem ser feitas em ciclos completos de 28 dias. A clareza vem com o tempo e os ciclos.</p>
`,
  );
}
