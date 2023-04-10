import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component:  HomeComponent,
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: HomeComponent,
        data: {

        }
      },
      {
        path: 'home',
        component: HomeComponent,
        data: {

        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild( routes )],
  exports: [RouterModule]
})
export class DashboardRoutingModule {

}