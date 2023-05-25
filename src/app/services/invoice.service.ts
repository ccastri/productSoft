import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ProductService } from './product.service';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import Swal from 'sweetalert2';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

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
  // TODO: Meter el resto de cossa dirección, telefono, cliente, vendedor, etc proveniente del formulario
  public currentInvoice: Invoice = { id: '', items: [], subtotal: 0 };
  invoiceCollection: AngularFirestoreCollection<Invoice>;
  private localStorageKey = 'currentInvoice';
  constructor(
    private productService: ProductService,
    public db: AngularFirestore
  ) {
    this.loadInvoiceFromLocalStorage();

    this.invoiceCollection = this.db.collection<Invoice>('facturas');
  }
  // Craga la factura actual: lo que ha sido agregadp y seleccionado por el front
  // La data esta guardada en el localStorage y se carga solo si info previa.
  // !*********Este metodo hara que el componente le permita al html  añadir un nuevo
  // !*********producto de la interfaz invoice (una nueva instancia de factura).
  // !*********se reciben el ID del producto, la cantidad y el listado de productos que
  // !*********el usuario ha elegido. El metodo retorna un Observable, la necesidad de crear un listado
  // !*********de objeto de tipo Invoice establece una lista Item[] en sus propiedades por lo cual
  // !*********Siempre que se encuentre el primer producto en stock suficiente, haga match con el ID
  // !*********Se asignan los valores actuales a las propiedades correspondientes de una nueva
  // !*********instancia de Invoice y dentro,la las propiedades de ID, la instancia correspondiente al
  // !*********listado de objetos con su id cantidad la marca, el modelo y el precio de cada uno
  // !*********de los elementos en la selección

  // !*********Cuando se crea el nuevo objeto de tipo item, se puede hacer un push en la
  // !*********propiedad de factura actual (que es almacenada en localStorage por el componente)
  // !*********Además se operan la cantidad por el precio de cada producto para sacar un subtotal
  // !*********Por producto y el subtotal global antes de impuestos
  // !*********Además del stock se descuenta la cantidad añadida a la factura
  // ! 1. Debí parsear quantity como numero porque al actualizar el valor se añadia como string
  // ! 2. Llamo el listado de productos para validar que el id del producto seleccionado coincida con un producto en la lista
  // ! 3. Valido que haya stock suficiente para añadir a la factura
  // ! 4. creo una variable que almacena la posicion dentro del listado de elementos
  // ! a facturar (InvoiceItems dentro del currentInvoice que es de tipo Item)
  // ! 5. Usando el indice del elemento seleccionado se compara el Id del producto
  // ! con el listado
  // ! 6. en la factura actual, solo si el elemento se encuentra registrado, se modifica la cantidad a comprar
  // ! 7. Si no está registrado en el listado de elementos a facturar se añade la instancia completa del producto
  // ! 8. Se hace push para añadir el nuevo elemento a la factura actual
  // ! 9. Se suma el subtotal  del producto por la cantidad
  // ! 10. Se descuenta la cantidad a comprar del stock actual del producto
  addProductToInvoice(productId: string, quantity: number): Observable<void> {
    const parsedQuantity = Number(quantity);
    return this.productService.getProductById(productId).pipe(
      take(1),
      map((product: Product | undefined) => {
        if (!product) {
          throw new Error(`Product with ID ${productId} not found`);
        }
        if (product.stockAmount < quantity) {
          throw new Error(`Not enough stock for product ${product.make}`);
        }
        const existingItemIndex = this.currentInvoice.items.findIndex(
          (item) => item.productId === productId
        );
        if (existingItemIndex !== -1) {
          // If the product already exists in the invoice, update the quantity
          this.currentInvoice.items[existingItemIndex].quantity += quantity;
        } else {
          // If the product doesn't exist in the invoice, add it as a new item
          const itemPrice = product.price;
          const item: InvoiceItem = {
            productId: product.id ?? '',
            make: product.make ?? '',
            model: product.model ?? '',
            quantity,
            price: itemPrice,
          };
          this.currentInvoice.items.push(item);
        }
        this.currentInvoice.subtotal += product.price * quantity;
        this.updateInvoice(this.currentInvoice);
        if (product.id) {
          this.productService.decreaseStockAmount(product.id, quantity);
        }
      })
    );
  }
  // !*********El servicio nos ayuda a tener el ID de cada producto que se seleccione
  // ! 1. filtro los productos que tienen true en el isSelected
  // ! 2.  de esos productos obtengo e id
  // ! 3. Filtro mi coleccion de productos para obtener solo los que tienen
  // ! id's que coincidan con el listado de ids seleccionados

  getSelectedProductsById(products: Product[]): Product[] {
    const selectedIds = products
      .filter((product) => product.isSelected)
      .map((product) => product.id);
    return products.filter((product) => selectedIds.includes(product.id));
  }
  // !*******Aqui filtramos por id comparando los elementos del listado de productos
  // !*******Obtenidos de la coleccion de firestore y el id proveniente de la seleccion del componente
  //
  getSelectedProductQuantity(products: Product[], productId: string): number {
    const product = products.find((product) => product.id === productId);
    return product?.quantity || 0;
  }
  // !**********Guardamos el currentInvoice (es el string definido
  // !**********en las propiedades del serivio). Devuelve JSON
  // !**********{currentInvoice:{id:'', InvoiceItem, }}
  // Save the currentInvoice to localStorage

  public updateInvoice(invoice: Invoice): void {
    this.currentInvoice = invoice;
    this.saveInvoiceToLocalStorage();
  }

  async addInvoiceToCollection(invoice: Invoice): Promise<any> {
    try {
      await this.invoiceCollection.add(invoice);
      // this.getProducts();
      Swal.fire('Completado', 'Factura añadida!', 'success');
    } catch (error) {
      console.error('Error adding product:', error);
      Swal.fire('Error', 'Failed to add product', 'error');
    }
  }
  // !---------------------------------------------------!
  // !-------------------LocalStorage--------------------!
  // !---------------------------------------------------!
  public loadInvoiceFromLocalStorage(): void {
    const invoiceData = localStorage.getItem(this.localStorageKey);
    if (invoiceData) {
      this.currentInvoice = JSON.parse(invoiceData);
    }
  }
  private saveInvoiceToLocalStorage(): void {
    localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(this.currentInvoice)
    );
  }

  // Update the currentInvoice and save it to localStorage

  public clearInvoiceFromLocalStorage(): void {
    localStorage.removeItem(this.localStorageKey);
  }
}
