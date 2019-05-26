import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: './modules/dashboard/dashboard.module#DashboardModule'
  },
  {
    path: 'lamps',
    loadChildren: './modules/lamp/lamp.module#LampModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
