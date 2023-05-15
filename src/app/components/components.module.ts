import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalFormComponent } from './modal-form/modal-form.component';

@NgModule({
  declarations: [ModalFormComponent],
  imports: [CommonModule, ModalFormComponent],
  exports: [ModalFormComponent],
})
export class FirebaseModule {}
