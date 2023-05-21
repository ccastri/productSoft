import { Component, OnInit } from '@angular/core';
import { ModalFormComponent } from 'src/app/components/modal-form/modal-form.component';
import { InvoiceService } from 'src/app/services/invoice.service';
// import { ModalImageCom}ponent } from 'src/app/components/modal-form/modal-form.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public isLoading: boolean = true;
  constructor(public invoiceService: InvoiceService) {}
  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
}
