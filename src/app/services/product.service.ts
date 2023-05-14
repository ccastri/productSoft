import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Product } from '../models/product.model';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // private productsRef = this.db.collection<Product>('products');
  productsCollection: AngularFirestoreCollection<Product>;

  constructor(private db: AngularFirestore) {
    {
      this.productsCollection = this.db.collection<Product>('productos');
      // this.products$ = this.productsCollection.snapshotChanges().pipe(
      //   map((actions) =>
      //     actions.map((a) => {
      //       const data = a.payload.doc.data() as Product;
      //       const id = a.payload.doc.id;
      //       return { id, ...data };
      //     })
      //   )
      // );
    }
  }
  getProducts(): Observable<Product[]> {
    return this.productsCollection.snapshotChanges().pipe(
      tap(console.log),
      map((changes) =>
        changes.map((c: any) => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data(),
        }))
      )
    );
  }

  // addProduct(product: Product): Promise<any> {
  //   return this.productsRef.push(product);
  // }

  // updateProduct(product: Product): Promise<void> {
  //   return this.productsRef.update(product.stockCode, product);
  // }

  // removeProduct(stockCode: string): Promise<void> {
  //   return this.productsRef.remove(stockCode);
  // }

  // getProducts(): Observable<Product[]> {
  //   return this.products$;
  // }

  // addStockAmount(stockCode: string, amount: number): Promise<void> {
  //   return this.productsRef.update(stockCode, { stockAmount: amount });
  // }

  // subtractStockAmount(stockCode: string, amount: number): Promise<void> {
  //   return this.db
  //     .object(`products/${stockCode}`)
  //     .query.ref.transaction((product) => {
  //       if (product && product.stockAmount >= amount) {
  //         product.stockAmount -= amount;
  //       }
  //       return product;
  //     });
  // }
}
