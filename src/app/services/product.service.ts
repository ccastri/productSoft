import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Product } from '../models/product.model';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // private productsRef = this.db.collection<Product>('products');
  productsCollection: AngularFirestoreCollection<Product>;
  private selectedProducts: Product[] = [];

  constructor(private db: AngularFirestore) {
    {
      this.productsCollection = this.db.collection<Product>('productos');
    }
  }
  //! async/await para obtener coleccion entera de productos
  // async fetchProducts(): Promise<Product[]> {
  //   try {
  //     const productsSnapshot = await this.productsCollection
  //       .snapshotChanges()
  //       .pipe(
  //         tap(console.log),
  //         map((changes) =>
  //           changes.map((c: any) => ({
  //             id: c.payload.doc.id,
  //             ...c.payload.doc.data(),
  //           }))
  //         )
  //       )
  //       .toPromise();

  //     return productsSnapshot;
  //   } catch (error) {
  //     console.error('Error fetching products:', error);
  //     throw error;
  //   }
  // }
  // ! getProducts without async/await
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
  // !async/await add product
  async addProduct(product: Product): Promise<any> {
    try {
      await this.productsCollection.add(product);
      Swal.fire('Success', 'Product added successfully!', 'success');
    } catch (error) {
      console.error('Error adding product:', error);
      Swal.fire('Error', 'Failed to add product', 'error');
    }
  }
  // ! async/await actualizar producto
  async updateProduct(product: Product): Promise<void> {
    const productRef = this.productsCollection.doc(product.id).ref;
    return await productRef.update(product);
  }
  // !Thats for deleting the document entirely
  async removeProduct(id: string): Promise<void> {
    console.log('Removing product:', id);
    const productRef = this.db.collection<Product>('products').doc(id).ref;
    await productRef.delete();
    console.log('Product removed:', id);
  }
  // ! async await para añadir stock
  async addStockAmount(id: string, amount: number): Promise<void> {
    try {
      const productRef = this.db.collection<Product>('productos').doc(id).ref;
      const productDoc = await productRef.get();
      const productData = productDoc.data();
      const newStockAmount = productData!.stockAmount + amount;
      await productRef.update({ stockAmount: newStockAmount });
    } catch (err) {
      console.error('Error updating stock amount:', err);
      throw err;
    }
  }
  //! async/await para disminuir stock
  async decreaseStockAmount(id: string, amount: number): Promise<void> {
    try {
      const productRef = this.db.collection<Product>('productos').doc(id).ref;
      const productDoc = await productRef.get();
      const productData = productDoc.data();
      const newStockAmount =
        productData && productData.stockAmount
          ? productData.stockAmount - amount
          : 0;
      console.log(newStockAmount);
      if (newStockAmount <= 0) {
        // Si el nuevo stock es menor o igual a cero, eliminamos el documento
        await productRef.delete();
      } else {
        // Si el nuevo stock es mayor a cero, actualizamos el stockAmount
        await productRef.update({ stockAmount: newStockAmount });
      }
    } catch (error) {
      console.error('Error decreasing stock amount:', error);
    }
  }
  // !async await para obtener producto por ID

  getProductById(id: string): Observable<Product | undefined> {
    console.log(id);
    try {
      const productDoc = this.db.doc<Product>(`productos/${id}`);
      console.log(productDoc);
      const product = productDoc.snapshotChanges().pipe(
        map((snapshot) => {
          if (!snapshot.payload.exists) {
            throw new Error(`Product with id ${id} not found`);
          }
          const data = snapshot.payload.data();
          const productId = snapshot.payload.id;
          if (data.stockAmount < 10) {
            Swal.fire('Alert', 'Stock amount is less than 10', 'warning');
          }
          console.log(productId);
          return { id: productId, ...data } as Product;
        })
      );
      console.log(product);
      return product;
    } catch (error) {
      console.error(error);
      return of(undefined);
    }
  }
  getSelectedProducts(): Product[] {
    return this.selectedProducts;
  }
}

const newProduct = {
  make: 'Samsung',
  model: 'Galaxy S21',
  description: 'Lorem ipsum dolor sit amet',
  price: '1000',
  stockAmount: 10,
  OS: 'Android',
  disadvantage: 'No disadvantages',
  screenSize: '6.2 inch',
  stockCode: 'ST-1234',
};
