import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalFormComponent } from './modal-form/modal-form.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [ModalFormComponent, LoaderComponent],
  imports: [CommonModule, ModalFormComponent],
  exports: [ModalFormComponent],
})
export class FirebaseModule {}
