import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ProductService } from './product.service';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

export interface InvoiceItem {
  productId: string;
  make: string;
  model: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  fecha?: string;
  id?: string;
  cliente?: string;
  direccion?: string;
  email?: string;
  items: InvoiceItem[];
  subtotal: number;
  descuento?: string;
  moneda?: string;
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  public currentInvoice: Invoice = { id: '', items: [], subtotal: 0 };
  private localStorageKey = 'currentInvoice';
  constructor(private productService: ProductService) {
    this.loadInvoiceFromLocalStorage();
  }
  addProductToInvoice(
    productId: string,
    products: Product[],
    quantity: number
  ): Observable<void> {
    return this.productService.getProductById(productId).pipe(
      take(1),
      map((product: Product | undefined) => {
        if (!product) {
          throw new Error(`Product with ID ${productId} not found`);
        }

        if (product.stockAmount < quantity) {
          throw new Error(`Not enough stock for product ${product.make}`);
        }

        const itemPrice = product.price;
        const item: InvoiceItem = {
          productId: product.id ?? '',
          make: product.make ?? '',
          model: product.model ?? '',
          quantity,
          price: itemPrice,
        };

        this.currentInvoice.items.push(item);
        this.currentInvoice.subtotal += itemPrice * quantity;
        this.updateInvoice(this.currentInvoice);
        if (product.id) {
          this.productService.decreaseStockAmount(product.id, quantity);
        }
      })
    );
  }

  getSelectedProducts(products: Product[]): Product[] {
    return products.filter((product) => product.isSelected);
  }
  getSelectedProductQuantity(products: Product[], productId: string): number {
    const product = products.find((product) => product.id === productId);
    return product?.quantity || 0;
  }

  // Load the currentInvoice from localStorage
  public loadInvoiceFromLocalStorage(): void {
    const invoiceData = localStorage.getItem(this.localStorageKey);
    if (invoiceData) {
      this.currentInvoice = JSON.parse(invoiceData);
    }
  }

  // Save the currentInvoice to localStorage
  private saveInvoiceToLocalStorage(): void {
    localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(this.currentInvoice)
    );
  }

  // Update the currentInvoice and save it to localStorage
  public updateInvoice(invoice: Invoice): void {
    this.currentInvoice = invoice;
    this.saveInvoiceToLocalStorage();
  }

  public clearInvoiceFromLocalStorage(): void {
    localStorage.removeItem(this.localStorageKey);
  }
}
