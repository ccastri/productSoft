import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// import { AuthModule } from './auth/auth.module';
// import { PagesModule } from './pages/pages.module';
// import { SharedModule } from './shared/shared.module';

import { MaterialModule } from './material.module';

import { AssetPipe } from './pipes/asset.pipes';

@NgModule({
  declarations: [AppComponent, AssetPipe],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // PagesModule,
    // SharedModule,
    // AuthModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
