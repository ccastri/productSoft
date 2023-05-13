import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notfound',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
})
export class NotfoundComponent implements OnInit {
  ngOnInit(): void {}
  year = new Date().getFullYear();
}
