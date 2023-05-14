// import { Injectable } from '@angular/core';
// import { AngularFireDatabase } from '@angular/fire/database';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { Product } from '../models/product.model';

// @Injectable({
//   providedIn: 'root',
// })
// export class ProductService {
//   private productsRef = this.db.list<Product>('products');

//   constructor(private db: AngularFireDatabase) {}

//   getProducts(): Observable<Product[]> {
//     return this.productsRef.snapshotChanges().pipe(
//       map((changes) =>
//         changes.map((c) => ({
//           stockCode: c.payload.key,
//           ...c.payload.val(),
//         }))
//       )
//     );
//   }

//   addProduct(product: Product): Promise<any> {
//     return this.productsRef.push(product);
//   }

//   updateProduct(product: Product): Promise<void> {
//     return this.productsRef.update(product.stockCode, product);
//   }

//   removeProduct(stockCode: string): Promise<void> {
//     return this.productsRef.remove(stockCode);
//   }

//   addStockAmount(stockCode: string, amount: number): Promise<void> {
//     return this.productsRef.update(stockCode, { stockAmount: amount });
//   }

//   subtractStockAmount(stockCode: string, amount: number): Promise<void> {
//     return this.db
//       .object(`products/${stockCode}`)
//       .query.ref.transaction((product) => {
//         if (product && product.stockAmount >= amount) {
//           product.stockAmount -= amount;
//         }
//         return product;
//       });
//   }
// }
