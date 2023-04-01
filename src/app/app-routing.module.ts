import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: []
  },
  {
    path: 'access',
    redirectTo: 'login'
  },
  {
    path: 'no-found',
    component: NotFoundComponent
  },
  {
    path: '',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then( ( m ) => m.DashboardModule ),
  },
  {
    path: '**',
    redirectTo: 'no-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule  {

}