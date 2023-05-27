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
  public isModalOpen: boolean = false;
  public uploadFile: File | undefined;
  products: Product[] = [];
  selectedProducts: Invoice | void = undefined; // New property to store selected products
  // currentInvoice: Invoice | void = undefined;
  public showInvoiceModal: boolean = false;
  @Input() public currentInvoice: Invoice | void = undefined;

  constructor(
    public productService: ProductService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    // this.selectedProducts = this.invoiceService.loadInvoiceFromLocalStorage();
    this.currentInvoice = this.invoiceService.loadInvoiceFromLocalStorage();
    console.log(this.currentInvoice);
    // this.loadCurrentInvoice();
  }

  // loadCurrentInvoice(): void {

  // removeFromInvoice(index: number): void {
  //   console.log(index);
  //   console.log(this.currentInvoice);
  //   if (this.invoice) {
  //     console.log(this.invoice);
  //     this.invoice.items.splice(index, 1);
  //     console.log(this.invoice);
  //     // this.currentInvoice.total = this.calculateTotal();
  //     this.invoiceService.updateInvoice(this.invoice);
  //     // this.toggleModal();
  //     this.selectedProducts = this.invoice;
  //   }
  // }
  clearInvoice(): void {
    console.log(this.currentInvoice);
    console.log('click');

    if (this.currentInvoice) {
      const items = this.currentInvoice.items;
      console.log(items);
      // Itera sobre cada item y devuelve las cantidades al stock del producto
      for (const item of items) {
        const productIndex = this.products.findIndex(
          (p) => p.id === item.productId
        );
        if (
          productIndex !== -1 &&
          this.products[productIndex].stockAmount !== undefined
        ) {
          // console.log(this.products[productIndex].stockAmount);
          console.log(item.quantity);
          // this.products[productIndex].stockAmount += item.quantity;
          this.productService.updateProduct(this.products[productIndex]);
        }
      }
      console.log(this.products);
      this.currentInvoice = { id: '', items: [], subtotal: 0 }; // Limpia la factura actual
      this.invoiceService.updateInvoice(this.currentInvoice);
      this.invoiceService.clearInvoiceFromLocalStorage();
      // this.toggle = false;
      this.currentInvoice.items = [];
    }
  }
  public confirmPurchase(): void {
    // Lógica para confirmar la compra
    if (this.currentInvoice) {
      console.log(this.currentInvoice);
      this.invoiceService.addInvoiceToCollection(this.currentInvoice);
    }
    // this.isShowInvoice = true;
    // Mostrar el modal de la factura
    this.isModalOpen = !this.isModalOpen;
  }
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
    console.log(this.isModalOpen);
    // this.saveSelectionToLocalStorage();
  }
}
