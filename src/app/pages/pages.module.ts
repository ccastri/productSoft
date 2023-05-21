import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';
import { CartComponent } from './cart/cart.component';
import { MaterialModule } from '../material.module';
import { AuthGuard } from '../guards/auth.guard';
import { PipesModule } from '../pipes/pipes.module';
import { LoaderComponent } from '../components/loader/loader.component';
import { ModalFormComponent } from '../components/modal-form/modal-form.component';
// import { ModalImageComponent } from '../components/modal-form/modal-form.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ProductsComponent,
    PagesComponent,
    CartComponent,
    LoaderComponent,
    ModalFormComponent,
  ],
  exports: [
    DashboardComponent,
    ProductsComponent,
    PagesComponent,
    ModalFormComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    RouterModule,
    SharedModule,
    PipesModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    // ModalFormComponent,
  ],
  providers: [AuthGuard], // Add AuthGuard to the providers array
})
export class PagesModule {}
// ! Este modulo contiene el componente del dashboard
// !Al que se podra acceder inmediatamente el guard devuelva un true
// !Despues de reconocer el inicio de sesion (in app module this.user = true)
// !De esta manera el cliente tiene acceso a las rutas privadas para el usuario
//! dashboard es de momento el primer nodo principal dentro del aplicativo
// !

// ! Este modulo contiene el componente del dashboard
// !Al que se podra acceder inmediatamente el guard devuelva un true
// !Despues de reconocer el inicio de sesion (in app module this.user = true)
// !De esta manera el cliente tiene acceso a las rutas privadas para el usuario
//! dashboard es de momento el primer nodo principal dentro del aplicativo
// !Se es capaz de usar

// ! Este modulo contiene el componente del dashboard
// !Al que se podra acceder inmediatamente el guard devuelva un true
// !Despues de reconocer el inicio de sesion (in app module this.user = true)
// !De esta manera el cliente tiene acceso a las rutas privadas para el usuario
//! dashboard es de momento el primer nodo principal dentro del aplicativo
// !Se es capaz
