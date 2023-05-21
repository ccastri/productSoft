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
  selectedProducts: Product[] = []; // New property to store selected products
  currentInvoice: Invoice | undefined;
  public showInvoiceModal: boolean = false;
  @Input() public invoice: Invoice | undefined;

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.selectedProducts = this.invoiceService.getSelectedProducts(
      this.products
    );
    this.loadCurrentInvoice();
  }

  loadCurrentInvoice(): void {
    this.currentInvoice = this.invoiceService.currentInvoice;
    console.log(this.currentInvoice);
    if (!this.currentInvoice) {
      this.invoiceService.loadInvoiceFromLocalStorage();
      this.currentInvoice = this.invoiceService.currentInvoice;
    }
    this.selectedProducts = this.invoiceService.getSelectedProducts(
      this.products
    );
  }

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

  public confirmPurchase(): void {
    // Lógica para confirmar la compra

    // Mostrar el modal de la factura
    this.showInvoiceModal = true;
  }
}
