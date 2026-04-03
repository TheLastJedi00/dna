import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { UserLogin } from './pages/user-login/user-login';
import { UserDashboard } from './pages/user-dashboard/user-dashboard';
import { HumanDesign } from './pages/human-design/human-design';
export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: UserLogin },
  { path: 'user-dashboard', component: UserDashboard },
  { path: 'human-design', component: HumanDesign },
];
