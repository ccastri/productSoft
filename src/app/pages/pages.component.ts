import { SidebarService } from 'src/app/services/sidebar.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { SettingsService } from '../services/settings.service';

declare function customInitFunctions(): any;
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [],
})
export class PagesComponent implements OnInit {
  constructor(
    private sidebarService: SidebarService,
    private route: ActivatedRoute
  ) {
    //  this.route.data.subscribe((data: { menu: any[] }) => {
    //    this.menuItems = data.menu;
    //  });
  } // private sidebarService: SidebarService // private SettingsService: SettingsService,

  ngOnInit(): void {
    // customInitFunctions();
    // localStorage.setItem('theme', url); //Me aseguro de que en localStorage siempre theme tenga un valor
    // this.sidebarService.loadMenu();
    // console.log(this.sidebarService.menu);
  }
}
