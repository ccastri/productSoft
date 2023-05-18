import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductService } from './product.service';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

// // Define la entidad para un producto
// // export interface Product {
// //   id: string;
// //   name: string;
// //   price: number;
// //   quantity: number;
// // }

// // Define la entidad para un ítem de la factura
export interface InvoiceItem {
  productId: string;
  quantity: number;
  price: number;
}

// // Define la entidad para la factura
export interface Invoice {
  id?: string;
  items: InvoiceItem[];
  total: number;
}
@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private currentInvoice: Invoice = { id: '', items: [], total: 0 };

  constructor(private productService: ProductService) {}

  addProductToInvoice(productId: string, quantity: number): Observable<void> {
    return this.productService.getProductById(productId).pipe(
      // !Si no hay un producto o es undefined
      map((product: Product | undefined) => {
        if (!product || product === undefined) {
          throw new Error(`Product with ID ${productId} not found`);
        }
        // !Cunado intentan comprar mas cantidad que el stock
        if (product.stockAmount < quantity) {
          throw new Error(`Not enough stock for product ${product.make}`);
        }
        // !Asignar el precio del producto seleccionado en el I|nvoiceItem
        const itemPrice = product.price;
        const item: InvoiceItem = {
          productId: product.id ?? '',
          quantity,
          price: itemPrice,
        };

        this.currentInvoice.items.push(item);
        this.currentInvoice.total += itemPrice * quantity;

        // Update the stock amount
        if (product.id) {
          this.productService.decreaseStockAmount(product.id, quantity);
        }
      })
    );
  }

  //   getCurrentInvoice(): Invoice {
  //     return this.currentInvoice;
  //   }
}
