import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
// import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    // component: DashboardComponent,
    // canActivate: [AuthGuard],
    // canLoad: [AuthGuard],
    loadChildren: () =>
      import('./child-routes.module').then((m) => m.ChildRoutesModule),
  },
  // {
  //   path: 'products',
  //   component: ProductsComponent,
  //   // canActivate: [AuthGuard],
  //   // canLoad: [AuthGuard],
  // },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
