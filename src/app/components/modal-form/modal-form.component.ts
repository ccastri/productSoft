import { ProductService } from 'src/app/services/product.service';
import { Component, OnInit, Input } from '@angular/core';
import { Invoice, InvoiceService } from '../../services/invoice.service';

import Swal from 'sweetalert2';
import { InvoiceComponent } from 'src/app/invoice/invoice.component';
import { take } from 'rxjs/operators';
import { Product } from 'src/app/models/product.model';
import { ModalService } from 'src/app/services/modal-invoice.service';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  styles: [],
})
export class ModalFormComponent implements OnInit {
  // public isModalOpen: boolean = false;
  public uploadFile: File | undefined;
  products: Product[] = [];
  selectedProducts: Invoice | void = undefined; // New property to store selected products
  // currentInvoice: Invoice | void = undefined;
  public showInvoiceModal: boolean = false;
  isLoading: boolean = false;
  @Input() public currentInvoice: Invoice | void = undefined;

  constructor(
    public productService: ProductService,
    private invoiceService: InvoiceService,
    public modalService: ModalService
  ) {}

  ngOnInit(): void {
    // this.selectedProducts = this.invoiceService.loadInvoiceFromLocalStorage();
    this.currentInvoice = this.invoiceService.currentInvoice;
    console.log(this.currentInvoice);
    console.log(this.modalService.toggleModal);
    // this.loadCurrentInvoice();
    this.productService
      .getProducts()
      .pipe(take(1))
      .subscribe((products) => {
        // const filteredProducts = products.filter((product) => {
        //   return !product.stockAmount || product.stockAmount <= 0;
        // });
        // this.products = [];
        this.products = products;
        console.log(this.products);
        // this.isLoading = false;
        // this.loadSelectionFromLocalStorage();

        // ! Carga los productos seleccionados
      });
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
      console.log(this.products);

      // Iterar sobre cada item y devolver las cantidades al stock del producto
      for (const item of items) {
        const productIndex = this.products.findIndex(
          (p) => p.id === item.productId
          // console.log(object)
        );
        if (
          productIndex !== -1 &&
          this.products[productIndex].stockAmount !== undefined
        ) {
          console.log(productIndex);
          console.log(this.products[productIndex].stockAmount);
          // const updatedProduct = { ...this.products[productIndex] }; // Crear una copia del producto actual

          // Devolver la cantidad del item al stock del producto
          // this.products[productIndex].stockAmount += item.quantity;

          // Actualizar el producto en Firebase
          this.productService.updateProduct(this.products[productIndex]);
        }
      }

      console.log(this.products);

      // Limpiar la factura actual
      this.currentInvoice = { id: '', items: [], subtotal: 0 };
      this.invoiceService.updateInvoice(this.currentInvoice);
      this.invoiceService.clearInvoiceFromLocalStorage();
      this.invoiceService.loadInvoiceFromLocalStorage();

      // Restablecer los items de la factura actual
      this.currentInvoice.items = [];
    }

    console.log(this.currentInvoice);

    // Cerrar el modal
    this.modalService.toggleModal();
  }
  public confirmPurchase(): void {
    // Lógica para confirmar la compra
    if (this.currentInvoice) {
      console.log(this.currentInvoice);
      this.invoiceService.addInvoiceToCollection(this.currentInvoice);
    }
    // this.isShowInvoice = true;
    // Mostrar el modal de la factura
    !this.modalService.isModalOpen;
    // this.isModalOpen = !this.isModalOpen;
  }
  toggleModal() {
    !this.modalService.isModalOpen;
    console.log(this.modalService.isModalOpen);
    // this.saveSelectionToLocalStorage();
  }
}
