import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ProductService } from './product.service';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

export interface InvoiceItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id?: string;
  items: InvoiceItem[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  public currentInvoice: Invoice = { id: '', items: [], total: 0 };

  constructor(private productService: ProductService) {}

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
          quantity,
          price: itemPrice,
        };

        this.currentInvoice.items.push(item);
        this.currentInvoice.total += itemPrice * quantity;

        // if (product.id) {
        //   this.productService.decreaseStockAmount(product.id, quantity);
        // }
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
}
