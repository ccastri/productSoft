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
  // TODO: Meter el resto de cossa dirección, telefono, cliente, vendedor, etc proveniente del formulario
  public currentInvoice: Invoice = { id: '', items: [], subtotal: 0 };
  private localStorageKey = 'currentInvoice';
  constructor(private productService: ProductService) {
    this.loadInvoiceFromLocalStorage();
  }
  // Craga la factura actual: lo que ha sido agregadp y seleccionado por el front
  // La data esta guardada en el localStorage y se carga solo si info previa.
  public loadInvoiceFromLocalStorage(): void {
    const invoiceData = localStorage.getItem(this.localStorageKey);
    if (invoiceData) {
      this.currentInvoice = JSON.parse(invoiceData);
    }
  }
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
  // !*********El servicio nos ayuda a tener el ID de cada producto que se seleccione
  getSelectedProducts(products: Product[]): Product[] {
    return products.filter((product) => product.isSelected);
  }
  // !*******Aqui filtramos por id comparando los elementos del listado de productos
  // !*******Obtenidos de la coleccion de firestore y el id proveniente de la seleccion del componente
  getSelectedProductQuantity(products: Product[], productId: string): number {
    const product = products.find((product) => product.id === productId);
    return product?.quantity || 0;
  }
  // !**********Guardamos el currentInvoice (es el string definido
  // !**********en las propiedades del serivio). Devuelve JSON
  // !**********{currentInvoice:{id:'', InvoiceItem, }}
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
