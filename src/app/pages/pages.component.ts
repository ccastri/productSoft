import { SidebarService } from 'src/app/services/sidebar.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';

// import { SettingsService } from '../services/settings.service';

declare function customInitFunctions(): any;
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [],
  animations: [slideInAnimation],
})
export class PagesComponent implements OnInit {
  public outlet: any;
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
  getRouteAnimation(outlet: RouterOutlet) {
    console.log('Route animation activated');
    return outlet?.activatedRouteData['animation'];
  }
}
