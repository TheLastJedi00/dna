import { Component, inject, input, OnInit, signal } from '@angular/core';
import { UserService } from '../../../core/services/user-service';
import { UserData } from '../../../core/models/userdata.model';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Infinity } from "../../loading/infinity/infinity";
import { UserSupplyItem } from "../../listed-item/user-supply-item/user-supply-item";
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-supply-list',
  imports: [Infinity, UserSupplyItem],
  templateUrl: './user-supply-list.html',
  styleUrl: './user-supply-list.scss',
})
export class UserSupplyList implements OnInit {
  async ngOnInit() {
    await this.getUsers()
  }

  private readonly service = inject(UserService)
  userSupplyUrl = input.required<string>()
  router = inject(Router)
  usersList = signal<UserData[]|null>(null)
  isLoading = signal(false)

  async getUsers(){
    this.isLoading.set(true)
    try {
      this.usersList.set(await firstValueFrom(this.service.getAllActiveUsers('fullName', 'asc'))) 
    } catch (e) {
      if(e instanceof HttpErrorResponse){
        alert(e.error.message)
      }
      console.error(e)
    } finally {
      this.isLoading.set(false)
    }
  }

  
}
