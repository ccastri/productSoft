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
      //Puntero en la coleccion de Productos
      this.productsCollection = this.db.collection<Product>('productos');
    }
  }

  //! async/await para obtener coleccion entera de productos
  // ! getProducts without async/await
  // ! 1. Mapea la coleccion de productos
  // ! 2. Mapea cada producto buscando cambios en sus propiedades
  // !    Devuelve el snapshot de la coleccion con los cambios realizados (si los hay.
  // !    sino, devuelve la misma coleccion)
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
  // !Para añadir un nuevo producto se necesita:
  // !1. apuntar a la coleccion
  // !2. Usar el metodo add de firebase
  // !3. Llamar getProducts para refrezcar el snapshot de la coleccion
  async addProduct(product: Product): Promise<any> {
    try {
      await this.productsCollection.add(product);
      this.getProducts();
      Swal.fire('Success', 'Product added successfully!', 'success');
    } catch (error) {
      console.error('Error adding product:', error);
      Swal.fire('Error', 'Failed to add product', 'error');
    }
  }
  // ! async/await actualizar producto
  // !1. apuntar a la coleccion
  // !2. Acceder al documento usando el id del producto
  // !3. utilizar el metodo update de firebase para actualizar el producto
  // !    que coincida con el id
  async updateProduct(product: Product): Promise<void> {
    const productRef = this.productsCollection.doc(product.id).ref;
    return await productRef.update(product);
  }
  // !Thats for deleting the document entirely
  // !1.Hacer la referencia al producto usando el id a eliminar
  // !2. Usar el metood delete de firebase en la referencia a la coleccion de productos
  async removeProduct(id: string): Promise<void> {
    console.log('Removing product:', id);
    const productRef = this.db.collection<Product>('products').doc(id).ref;
    await productRef.delete();
    console.log('Product removed:', id);
  }
  // ! async await para añadir stock
  // !1. Se hace la referencia a la coleccion con el id del producto
  // !2. Se invoca el metodo get de firebase para llamar la data
  // !3. Se invoca el metodo data para obtener la data del documento
  // !4. Se suma la nueva cantidad de stock digitada con lo que se encuentra actualmente en stock
  // !4. Se invoca el metodo update para actualizar el nuevo stock
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
  // ! async await para añadir stock
  // !1. Se hace la referencia a la coleccion con el id del producto
  // !2. Se invoca el metodo get de firebase para llamar la data
  // !3. Se invoca el metodo data para obtener la data del documento
  // !4. Se resta la nueva cantidad de stock digitada con lo que se encuentra actualmente en stock
  // !5. Si el nuevo stock  es un numero negativo, elimina el documento
  // !6. Se invoca el metodo update para actualizar el nuevo stock
  async decreaseStockAmount(id: string, amount: number): Promise<void> {
    try {
      const productRef = this.db.collection<Product>('productos').doc(id).ref;
      const productDoc = await productRef.get();
      const productData = productDoc.data();
      const newStockAmount = productData!.stockAmount - amount;

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
  // !Consultar la coleccion:
  // !1. Si el id coincide se hace el snapshot de en la coleccion
  // !2. Retorna el documento asociado con el id recibido
  // !   La variable data contiene la data del documento
  // !3. el motodo devuelve el producto con la info actualizada

  getProductById(id: string): Observable<Product | undefined> {
    try {
      const productDoc = this.db.doc<Product>(`productos/${id}`);
      const product = productDoc.snapshotChanges().pipe(
        map((snapshot) => {
          if (!snapshot.payload.exists) {
            throw new Error(`Product with id ${id} not found`);
          }
          const data = snapshot.payload.data();
          const productId = snapshot.payload.id;
          return { id: productId, ...data } as Product;
        })
      );
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
