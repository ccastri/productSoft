import { Injectable } from '@angular/core';
import { InvoiceService } from './invoice.service';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  public isModalOpen: boolean = false;

  constructor(private invoiceService: InvoiceService) {}

  public toggleModal(): boolean {
    return (this.isModalOpen = !this.isModalOpen);
  }

  public confirmPurchase(): void {
    if (this.invoiceService.currentInvoice) {
      // Update the products in currentInvoice before adding them to the final invoice
      this.updateProductsInCurrentInvoice();
      this.invoiceService.addInvoiceToCollection(
        this.invoiceService.currentInvoice
      );
    }
    this.toggleModal();
  }

  private updateProductsInCurrentInvoice(): void {
    const products = this.invoiceService.currentInvoice.items;
    console.log(products);
    // Update the products or perform any necessary logic
    // For example, you can iterate over the products and update their properties

    // ...

    // After updating the products, you can assign them back to currentInvoice
    this.invoiceService.currentInvoice.items = products;
  }
}
