import { Component, inject, OnInit, signal } from '@angular/core';
import { DhIntroCard } from '../../../shared/cards/dh-intro-card/dh-intro-card';
import { VerticalAccordion } from '../../../shared/accordions/vertical-accordion/vertical-accordion';
import { ListsCardGrid } from '../../../shared/grid/lists-card-grid/lists-card-grid';
import { SupplyService } from '../../../core/services/supply.service';
import { Topic } from '../../../core/models/supply.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil',
  imports: [DhIntroCard, VerticalAccordion, ListsCardGrid],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly supplyService = inject(SupplyService);

  readonly userId = signal('');
  topics = signal<Topic[] | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const userId = this.route.snapshot.parent!.paramMap.get('userId') ?? '';
    this.userId.set(userId);

    this.supplyService.getHumanDesignModule(userId, 'perfil').subscribe({
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

  paragrafosIntro = signal([
    'No Desenho Humano, o Perfil é uma das peças mais importantes do seu mapa. Ele revela como você vive a sua experiência humana, como aprende, como se conecta com os outros e como constrói sua identidade no mundo.',
    'Se o Tipo Áurico fala sobre a sua energia e forma de agir, o Perfil mostra o papel que você representa nessa vida — a sua "roupagem de alma".',
    'Cada pessoa nasce com um Perfil composto por duas Linhas — a primeira vem da posição do Sol na sua Personalidade (consciente) e a segunda vem do Sol no seu Desenho (inconsciente). Essa combinação forma um arco narrativo da sua jornada: como você se enxerga + como o mundo te enxerga + como você age no mundo.',
    'Existem 12 Perfis possíveis no Desenho Humano, cada um formado por combinações entre as 6 Linhas de base. Cada linha representa uma frequência arquetípica, um modo de ser e se mover.',
  ]);

  tiposPerfis = signal(`
  <p><b>Linha 1 – O Investigador:</b> Precisa de segurança, base sólida e conhecimento profundo.</p>
  <p><b>Linha 2 – O Natural / Eremita:</b> Tem dons inatos e precisa de espaço e tempo para si.</p>
  <p><b>Linha 3 – O Martir / Experimentador:</b> Aprende pela tentativa e erro, precisa liberdade para testar.</p>
  <p><b>Linha 4 – O Influenciador / Amigo:</b> Cresce por meio das suas conexões próximas e redes de apoio.</p>
  <p><b>Linha 5 – O Herói / Solucionador:</b> Resolve problemas dos outros, tem aura projetada e magnética.</p>
  <p><b>Linha 6 – O Exemplo / Modelo de Vida:</b> Vive em três fases e se torna um guia sábio depois dos 50 anos.</p>
`);
}
