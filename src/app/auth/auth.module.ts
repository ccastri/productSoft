import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { PipesModule } from '../pipes/pipes.module';
// import { LoaderComponent } from '../components/loader/loader.component';y

const AUTH_COMPONENT = [LoginComponent, RegisterComponent];

@NgModule({
  declarations: [AUTH_COMPONENT],
  exports: [AUTH_COMPONENT],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PipesModule,
  ],
})
export class AuthModule {}
