import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  // !To get it from the back when isAuth
  // public menu = [];
  // loadMenu() {
  //   this.menu = JSON.parse(localStorage.setItem('menu')) || [];
  // }

  menu: any[] = [
    {
      title: 'Dashboard',
      icon: 'dashboard_customize',
      submenu: [
        // { title: 'Principal', url: '/' },
        { title: 'Inventario', url: 'products', icon: 'storage' },
        { title: 'Ordenes', url: 'oders', icon: 'event' },
        { title: 'Facturacion', url: 'cart', icon: 'local_shipping' },
        // { title: 'Estadisticas', url: 'chart1' },
      ],
    },
    // ! If you would like to have nested routes
    // {
    //   title: 'Maintenance',
    //   icon: 'mdi mdi-folder-lock-open',
    //   submenu: [
    //     { title: 'Users', url: 'users' },
    //     { title: 'Doctors', url: 'doctors' },
    //     { title: 'Hospitals', url: 'hospitals' },
    //   ],
    // },
  ];
  constructor() {}
}
