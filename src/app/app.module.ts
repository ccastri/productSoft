//!----------Module import dividida por core + third parties + personalizados !---------
//!----------Module import dividida por core + third parties + personalizados !---------
//!----------Module import dividida por core + third parties + personalizados !---------
// ********![Core]¡****************//
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Third party modules
import { MaterialModule } from './material.module';
import { FirebaseModule } from './firebase/firebase.module';
// Custom: En el modulos de paginacion vas a encontrar las rutas hijas
//  renderizadas en el servicio del menu lateral
import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';
// En los pipes está implementado el formato para el path de las imagenes directamente
// dirigido a src=/assets/name_of_img.format  i.e: src=assets/profilePicture
// TODO: implementar el formato de divisas para la tabla de inventarios y la factura
// import { AssetPipe } from './pipes/asset.pipe';
import { SharedModule } from './shared/shared.module';
import { NotfoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [AppComponent, NotfoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    SharedModule,
    AuthModule,
    MaterialModule,
    FirebaseModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
// Todo: el pipe no me está Funcionando somehow
