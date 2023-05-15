import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

// import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';
import { CartComponent } from './cart/cart.component';
import { MaterialModule } from '../material.module';
// import { AssetPipe } from '../pipes/asset.pipes';

@NgModule({
  declarations: [
    DashboardComponent,
    ProductsComponent,
    PagesComponent,
    CartComponent,
    // AssetPipe,
  ],
  exports: [DashboardComponent, ProductsComponent, PagesComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    RouterModule,
    SharedModule,
    // AssetPipe,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
  ],
})
export class PagesModule {}
