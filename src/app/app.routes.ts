import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { UserLogin } from './pages/user-login/user-login';
import { UserDashboard } from './pages/user-dashboard/user-dashboard';
import { HumanDesign } from './pages/human-design/human-design';
import { HumanDesignHome } from './pages/human-design/human-design-home/human-design-home';
import { HumanDesignTipoAurico } from './pages/human-design/human-design-tipo-aurico/human-design-tipo-aurico';
import { Autoridade } from './pages/human-design/autoridade/autoridade';
import { Perfil } from './pages/human-design/perfil/perfil';
import { Encarnacao } from './pages/human-design/encarnacao/encarnacao';
import { Centros } from './pages/human-design/centros/centros';
export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: UserLogin },
  { path: 'user-dashboard', component: UserDashboard },
  {
    path: 'human-design',
    component: HumanDesign,
    children: [
      {
        path: '', component: HumanDesignHome
      },
      {
        path: 'tipo-aurico', component: HumanDesignTipoAurico
      },
      {
        path: 'autoridade', component: Autoridade
      },
      {
        path: 'perfil', component: Perfil
      },
      {
        path: 'encarnacao', component: Encarnacao
      },
      {
        path: 'centros', component: Centros
      }
    ],
  },
];
