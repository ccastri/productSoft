import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Modules
// import { PagesRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth.routing';
import { NotfoundComponent } from './not-found/not-found.component';
import { PagesRoutingModule } from './pages/pages.routing';

// import { NotfoundComponent } from './notfound/notfound.component';

const routes: Routes = [
  // path:'/dashboard' pagesRouting
  // path:'/auth' authRouting
  // path:'/dashboard' pagesRouting
  // path:'/dashboard' pagesRouting
  // !Rutas vacias redirigen al /dashboard
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  //! Rutas no encontradas redirigen a component not found
  { path: '**', component: NotfoundComponent }, //Errores de direccion URL not page found
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes), //Solo rutas principales. forchild rutas hijas
    PagesRoutingModule,
    AuthRoutingModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
