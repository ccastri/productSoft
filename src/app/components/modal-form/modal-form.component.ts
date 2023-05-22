import { ProductService } from 'src/app/services/product.service';
import { Component, OnInit, Input } from '@angular/core';
import { Invoice, InvoiceService } from '../../services/invoice.service';

import Swal from 'sweetalert2';
import { InvoiceComponent } from 'src/app/invoice/invoice.component';
import { take } from 'rxjs/operators';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  styles: [],
})
export class ModalFormComponent implements OnInit {
  // public hideModal: boolean = false;
  public uploadFile: File | undefined;
  products: Product[] = [];
  selectedProducts: Invoice | void = undefined; // New property to store selected products
  currentInvoice: Invoice | void = undefined;
  public showInvoiceModal: boolean = false;
  @Input() public invoice: Invoice | void = undefined;

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.selectedProducts = this.invoiceService.loadInvoiceFromLocalStorage();
    // this.invoice = this.invoiceService.loadInvoiceFromLocalStorage();
    // this.loadCurrentInvoice();
  }

  // loadCurrentInvoice(): void {
  clearInvoice(): void {
    if (this.currentInvoice) {
      this.currentInvoice = { id: '', items: [], subtotal: 0 }; // Remove all items from the items array
      // this.currentInvoice.total = this.calculateTotal();
      this.invoiceService.updateInvoice(this.currentInvoice);
      this.invoiceService.clearInvoiceFromLocalStorage();
      // this.isModalOpen = false;
      this.currentInvoice.items = [];
    }
  }
  removeFromInvoice(index: number): void {
    console.log(index);
    console.log(this.currentInvoice);
    if (this.invoice) {
      console.log(this.invoice);
      this.invoice.items.splice(index, 1);
      console.log(this.invoice);
      // this.currentInvoice.total = this.calculateTotal();
      this.invoiceService.updateInvoice(this.invoice);
      // this.toggleModal();
      this.selectedProducts = this.invoice;
    }
  }
}
