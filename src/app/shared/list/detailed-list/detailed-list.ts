import { Component, inject, input, OnInit, signal } from '@angular/core';
import { DetailedItem } from '../../listed-items/detailed-item/detailed-item';
import { UserService } from '../../../core/services/user.service';
import { firstValueFrom } from 'rxjs';
import { UserData } from '../../../core/models/userdata.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Infinity } from '../../loading/infinity/infinity';
import { NewUserForm } from '../../forms/new-user-form/new-user-form';

@Component({
  selector: 'app-detailed-list',
  imports: [DetailedItem, Infinity, NewUserForm],
  templateUrl: './detailed-list.html',
  styleUrl: './detailed-list.scss',
})
export class DetailedList implements OnInit {
  private readonly userService = inject(UserService);
  managerId = input.required<string>();

  async ngOnInit() {
    this.userList.set(await this.getAllActiveUsersFirstPage());
  }
  userList = signal<UserData[] | null>(null);
  isLoading = signal<boolean>(false);
  type = input.required<string>();

  async getAllActiveUsersFirstPage() {
    this.isLoading.set(true);
    try {
      return await firstValueFrom(this.userService.getAllActiveUsers('fullName', 'asc', 1));
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        alert(e.error.message);
      }
      throw new Error('Erro desconhecido');
    } finally {
      this.isLoading.set(false);
    }
  }
}
