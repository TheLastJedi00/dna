import { Component, inject, OnInit, signal } from '@angular/core';
import { UserDataCard } from '../../../shared/cards/user-data-card/user-data-card';
import { NumerologyService } from '../../../core/services/numerology.service';
import { NumerologyData } from '../../../core/models/numdata.model';
import { NumDataButton } from '../../../shared/buttons/num-data-button/num-data-button';
import { UserData } from '../../../core/models/userdata.model';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../core/services/user.service';
import { Infinity } from '../../../shared/loading/infinity/infinity';

@Component({
  selector: 'app-home',
  imports: [UserDataCard, NumDataButton, Infinity],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly numerologyService = inject(NumerologyService);
  private readonly userService = inject(UserService);
  readonly userId = signal('');
  isLoading = signal(false);
  userData = signal<UserData | null>(null);
  numData = signal<NumerologyData | null>(null);

  async ngOnInit() {
    const userId = this.route.snapshot.parent!.paramMap.get('userId') ?? '';
    this.userId.set(userId);
    await this.getNumerologyData();
    await this.getUserData();
  }

  navigateTo(path: string) {
    this.router.navigate([`numerology/${this.userId()}/${path}`]);
  }

  async getNumerologyData() {
    this.isLoading.set(true);
    try {
      const data = await firstValueFrom(this.numerologyService.getByUserId(this.userId()));
      this.numData.set(data);
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        alert(e.error.message);
      }
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  async getUserData() {
    this.isLoading.set(true);
    try {
      const user = await firstValueFrom(this.userService.findUserById(this.userId()));
      this.userData.set(user);
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        alert(e.error.message);
      }
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }
}
