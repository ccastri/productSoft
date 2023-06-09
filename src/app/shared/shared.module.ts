import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AssetPipe } from '../pipes/asset.pipe';
// import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
// import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { PipesModule } from '../pipes/pipes.module';

const SHARED_COMPONENT = [
  // BreadcrumbsComponent,
  SidebarComponent,
  // HeaderComponent,
];

@NgModule({
  declarations: [SHARED_COMPONENT],

  exports: [SHARED_COMPONENT],

  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    PipesModule,
  ],
})
export class SharedModule {}
