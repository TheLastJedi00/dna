import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { UserLogin } from './pages/user-login/user-login';
export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: UserLogin }
];
