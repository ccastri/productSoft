import { Component, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { User } from 'src/app/models/user.model';
import { AssetPipe } from '../../pipes/asset.pipes';

import { SidebarService } from 'src/app/services/sidebar.service';

import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit {
  // public user: User;

  constructor(
    public sidebarService: SidebarService,
    private userService: UserService
  ) {
    // this.user = userService.user;
  }
  ngOnInit(): void {}
  //! async await para cierre de sesion
  // async logout() {
  //   try {
  //     const result = await Swal.fire({
  //       title: '¿Está seguro que desea cerrar sesión?',
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: 'Sí, cerrar sesión',
  //       cancelButtonText: 'Cancelar',
  //     });

  //     if (result.isConfirmed) {
  //       await this.userService.logout();
  //       Swal.fire('Completado', 'La sesión ha sido cerrada.', 'success');
  //     }
  //   } catch (error) {
  //     Swal.fire('Error', error.message, 'error');
  //   }
  // }
  //!  cierre de sesion
  logout() {
    Swal.fire({
      title: '¿Está seguro que desea cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.logout();
        Swal.fire('Completado', 'La sesión ha sido cerrada.', 'success');
      }
    });
  }
}
