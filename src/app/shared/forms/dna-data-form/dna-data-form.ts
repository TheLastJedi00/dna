import { Component, inject, input, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { UserData } from '../../../core/models/userdata.model';
import { DnaStatus } from '../../../core/models/dna-status.model';
import { HumanDesignData } from '../../../core/models/dhdata.model';
import { DnaStatusService } from '../../../core/services/dna-status.service';
import { HumanDesignService } from '../../../core/services/human-design.service';
import { HumanDesignForm } from '../human-design-form/human-design-form';

@Component({
  selector: 'app-dna-data-form',
  imports: [HumanDesignForm],
  templateUrl: './dna-data-form.html',
  styleUrl: './dna-data-form.scss',
})
export class DnaDataForm implements OnInit {
  readonly userData = input.required<UserData>();

  private readonly dnaStatusService = inject(DnaStatusService);
  private readonly humanDesignService = inject(HumanDesignService);

  isLoading = signal(true);
  dnaStatus = signal<DnaStatus | null>(null);
  humanDesignData = signal<HumanDesignData | null>(null);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.getDnaStatus();
  }

  async getDnaStatus(): Promise<void> {
    const userId = this.userData().id!;
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const status = await firstValueFrom(
        this.dnaStatusService.getStatusByUserId(userId)
      );
      this.dnaStatus.set(status);

      if (status.human_design) {
        const hd = await firstValueFrom(
          this.humanDesignService.getByUserId(userId)
        );
        this.humanDesignData.set(hd);
      }
    } catch {
      this.error.set('Erro ao carregar dados do DNA. Tente novamente.');
    } finally {
      this.isLoading.set(false);
    }
  }

  // ── Getters para o template ──────────────────────────────────────────
  get canaisFormatados(): string {
    return this.humanDesignData()?.canais.map(c => c.nome).join(', ') || '—';
  }

  get centrosDefinidos(): string {
    return this.humanDesignData()?.centros_energeticos.definidos.join(', ') || '—';
  }

  get centrosIndefinidos(): string {
    return this.humanDesignData()?.centros_energeticos.indefinidos.join(', ') || '—';
  }

  get centrosAbertos(): string {
    return this.humanDesignData()?.centros_energeticos.abertos.join(', ') || '—';
  }
}
