import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, data: { title: 'Dashboard' } },
  // ! Here for getting loaders
  // {
  //   path: 'progress',
  //   component: LoaderComponent,
  //   data: { title: 'Loader' },
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
