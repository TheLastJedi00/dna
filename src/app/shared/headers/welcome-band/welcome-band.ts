import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Skeleton } from '../../feedback/skeleton/skeleton';

/** Gera os dois fios e os degraus da hélice decorativa (viewBox 120×320). */
function helixPaths() {
  const height = 320;
  const center = 60;
  const amplitude = 34;
  const turns = 2.2;
  const x = (y: number, phase: number) =>
    center + amplitude * Math.sin((y / height) * 2 * Math.PI * turns + phase);
  const strand = (phase: number) => {
    const points: string[] = [];
    for (let y = -10; y <= height + 10; y += 4) {
      points.push(`${x(y, phase).toFixed(1)} ${y}`);
    }
    return `M${points.join(' L')}`;
  };
  const rungs: { x1: string; x2: string; y: number }[] = [];
  for (let y = 6; y < height; y += 16) {
    rungs.push({ x1: x(y, 0).toFixed(1), x2: x(y, Math.PI).toFixed(1), y });
  }
  return { a: strand(0), b: strand(Math.PI), rungs };
}

const HELIX = helixPaths();

/**
 * Faixa de boas-vindas dos dashboards e do Meu Perfil (spec 010): fundo
 * espresso, o nome da pessoa em Style Script e uma hélice de DNA em ouro que
 * se desenha **uma vez** ao abrir (estática com `prefers-reduced-motion`).
 * Referência visual: `.claude/specs/010 - …/preview.html`.
 *
 * O nome é `null` enquanto carrega (skeleton). Quando o nome é um e-mail
 * (Manager sem perfil), vai em Merriweather, menor, para não estourar.
 * Conteúdo extra (frase de apoio, selos, voltar) entra por projeção.
 */
@Component({
  selector: 'app-welcome-band',
  imports: [Skeleton],
  templateUrl: './welcome-band.html',
  styleUrl: './welcome-band.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeBand {
  /** Linha acima do nome ("Olá," / "Meu perfil"). */
  greeting = input<string>('Olá,');
  name = input<string | null>(null);
  /** O nome exibido é um e-mail (fallback): tipografia menor. */
  nameIsEmail = input<boolean>(false);
  /** Versão mais baixa, para páginas internas (Meu Perfil). */
  compact = input<boolean>(false);

  readonly helix = HELIX;
}
