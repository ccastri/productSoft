import { NgModule } from '@angular/core';

// import { AccountSettingsComponent } from './account-settings/account-settings.component';

import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { CartComponent } from './cart/cart.component';

// import { Grafica1Component } from './grafica1/grafica1.component';
// import { DoctorComponent } from './mainteneance/doctors/doctor.component';
// import { DoctorsComponent } from './mainteneance/doctors/doctors.component';
// import { HospitalsComponent } from './mainteneance/hospitals/hospitals.component';
// ! Admin component for users
// import { UsersComponent } from './mainteneance/users/users.component';
// import { ProfileComponent } from './profile/profile.component';
// import { ProgressComponent } from './progress/progress.component';
// import { PromisesComponent } from './promises/promises.component';
// import { RxjsComponent } from './rxjs/rxjs.component';
// import { SearchComponent } from './search/search.component';

const childRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: { title: 'Dashboard', animation: 'fade' },
  },
  {
    path: 'products',
    component: ProductsComponent,
    data: { title: 'Catalog', animation: 'fade' },
  },
  {
    path: 'cart',
    component: CartComponent,
    data: { title: 'Ready to pay', animation: 'fade' },
  },
  // {
  //   path: 'chart1',
  //   component: Grafica1Component,
  //   data: { title: 'Charts' },
  // },
  // {
  //   path: 'account-settings',
  //   component: AccountSettingsComponent,
  //   data: { title: 'Theme' },
  // },
  // {
  //   path: 'search/:pattern',
  //   component: SearchComponent,
  //   data: { title: 'Searchs' },
  // },
  // {
  //   path: 'promises',
  //   component: PromisesComponent,
  //   data: { title: 'Promises' },
  // },
  // { path: 'rxjs', component: RxjsComponent, data: { title: 'Rxjs' } },
  // {
  //   path: 'profile',
  //   component: ProfileComponent,
  //   data: { title: 'My profile' },
  // },
  //Paths vacios redirect to dashboard
  // Mainteneance
  // Rutas de Admin
  //   {
  //     path: 'users',
  //     canActivate: [AdminGuard],
  //     component: UsersComponent,
  //     data: { title: 'Users' },
  //   },
  //   {
  //     path: 'hospitals',
  //     component: HospitalsComponent,
  //     data: { title: 'Hospitals' },
  //   },
  //   {
  //     path: 'doctors',
  //     component: DoctorsComponent,
  //     data: { title: 'Doctors' },
  //   },
  //   {
  //     path: 'doctor/:id',
  //     component: DoctorComponent,
  //     data: { title: 'Doctor' },
  //   },
];

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule],
})
export class ChildRoutesModule {}
