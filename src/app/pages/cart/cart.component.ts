import { MaterialModule } from 'src/app/material.module';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

import { take } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Invoice, InvoiceService } from 'src/app/services/invoice.service';
import { ModalFormComponent } from 'src/app/components/modal-form/modal-form.component';
import { CurrencyFormatPipe } from 'src/app/pipes/cuurency.pipe';

// private currencyPipe: CurrencyPipe,
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;
  isModalOpen = false;
  amountToAdd: number = 0;
  amountToDecrease: number = 0;

  // selectedProduct: Product | undefined;
  isSelected?: boolean;
  isShowInvoice?: boolean = false;
  currentInvoice: Invoice | undefined;
  public formSubmitted = false;
  public productForm = this.fb.group({
    make: ['', Validators.required],
    model: ['', Validators.required],
    price: [0, Validators.required],
    stockAmount: [0, Validators.required],

    stockCode: ['', Validators.required],
  });
  constructor(
    public productService: ProductService,
    private fb: FormBuilder,
    private db: AngularFirestore,
    public invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
    // !Toma el primer arreglo de productos que encuentre
    this.productService
      .getProducts()
      .pipe(take(1))
      .subscribe((products) => {
        // console.log(products);

        this.products = products;
        // ! Carga los productos seleccionados
        this.loadSelectionFromLocalStorage();
      });
    this.currentInvoice = this.invoiceService.currentInvoice;
    if (!this.currentInvoice) {
      // Load the currentInvoice from localStorage if it's not already set
      this.invoiceService.loadInvoiceFromLocalStorage();
      this.currentInvoice = this.invoiceService.currentInvoice;
    }
  }
  // ************** !Aqui se ejecuta el proceso para añadir los productos:¡**************//
  // 1. se define una constante que almacene arreglo de los productos seleccionados: selectedProducts
  // 2.Por cada producto seleccionado en el servicio se va a realizar la siguiente operacion:
  // -Subscripcion: 1. se asigna el valor  de la factura en el servicio a la variable de factura actual local
  //                2. se cierra el modal
  addProductsToInvoice() {
    const selectedProducts = this.invoiceService.getSelectedProductsById(
      this.products
    );
    for (const product of selectedProducts) {
      if (product.id && product.quantity) {
        this.invoiceService
          .addProductToInvoice(product.id, product.quantity)
          .subscribe(
            () => {
              // Success handling, if needed
              this.currentInvoice = this.invoiceService.currentInvoice;
              console.log(this.currentInvoice);
              this.toggleModal();
              console.log(
                'Product has been added or quantity updated successfully'
              );
            },
            (error) => {
              console.error(error);
              // Error handling, if needed
            }
          );
      }
    }
    console.log(selectedProducts);
  }
  // 1. Desde el servicio Seleccionamos la cantidad en stock del Id recibido
  //    Recibimos el Id de c/producto y el producto como tal
  // 2. El servicio retorna la cantidad del producto asociado con el id ó 0 por defecto
  getSelectedProductQuantity(productId: string): number {
    return this.invoiceService.getSelectedProductQuantity(
      this.products,
      productId
    );
  }
  // This is to get the chosen products quantity to be invoiced
  //  the num variable loops through the stock.amount prop in the html
  //  1. Recibimos el stock de cada producto
  //  2. iteramos por el numero de unidades que tenga cada producto
  //  3. De esta manera en el selector de la cantidad a facturar se puede asignar el valor (num)
  getNumberArray(stock: number): number[] {
    return Array(stock)
      .fill(0)
      .map((x, i) => i + 1);
  }
  // Vamos a remover el producto de la factura siempre y cuando haya una factura actualmente en memoria
  // 1. Usamos splice() para eliminar el primer elemento que coincida con el indice
  // 2. Se actualiza la factura actual llamando el metodo update servicio
  removeFromInvoice(index: number): void {
    if (this.currentInvoice) {
      this.currentInvoice.items.splice(index, 1);
      // this.currentInvoice.total = this.calculateTotal();
      this.invoiceService.updateInvoice(this.currentInvoice);
      this.toggleModal();
    }
  }
  // Para limpiar todo el invoice actual:
  // 1.Cuando exista una factura actual se reinician los valores
  // 2. Se actualiza el valor de factura actual desde el servicio
  // 3. Se limpia la memoria del localStorage desde el servicio
  // 4. Se cierra el modal
  // 5. El listado de productos de la factura actual almacenada localmente se asigna a cero nuevamente
  clearInvoice(): void {
    if (this.currentInvoice) {
      this.currentInvoice = { id: '', items: [], subtotal: 0 }; // Remove all items from the items array
      // this.currentInvoice.total = this.calculateTotal();
      this.invoiceService.updateInvoice(this.currentInvoice);
      this.invoiceService.clearInvoiceFromLocalStorage();
      this.isModalOpen = false;
      this.currentInvoice.items = [];
    }
  }
  // Abrir/cerrar el modal
  // 1. logica invertida para hacer el cirre/apertura
  // 2. guardamos los productos preservados en la lista del modal
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
    this.saveSelectionToLocalStorage();
  }
  // 1. Solo cunado haya una factura actual
  // 2. Se llama al servicio de facturacion para que adicione la factura actual como
  //    un nuevo documento en la coleccion de facturas (si no existe, firebase la crea)
  // 3. El listado de productos se muestra debajo del formulario para editar tambien los demás campos de la factura
  // 4. Se cierra el modal
  public confirmPurchase(): void {
    // Lógica para confirmar la compra
    if (this.currentInvoice) {
      console.log(this.currentInvoice);
      this.invoiceService.addInvoiceToCollection(this.currentInvoice);
    }
    this.isShowInvoice = true;
    // Mostrar el modal de la factura
    this.isModalOpen = !this.isModalOpen;
  }
  //  1. Se llama lo que haya en localStorage bajo la clave selectedProducts
  //  2. Se valida que existan productos seleccionados y se parsean de objeto plano a JSON
  //  3. Busca el primer id dentro del arreglo de productos seleccionados que coincida con
  //  el producto seleccionado por el usuario y devuelve el indice dentro del arreglo de productos
  //  4. El resto de id's devuelven -1

  private getStoredProductIndex(productId: string): number {
    const storedProductsString = localStorage.getItem('selectedProducts');
    if (storedProductsString) {
      const storedProducts: any[] = JSON.parse(storedProductsString);
      return storedProducts.findIndex((product) => product.id === productId);
    }
    return -1;
  }
  //  1. Se declara una variable local para almacenar los productos a facturar
  //  2. Del listado de productos se validan tanto el id como la cantidad
  //  3. Se asignan como un objeto dentro del arreglo de productos seleccionados
  //  4. Se valida que el id del producto almacenado no haya sido añadido previamente
  //  5. Cuando devuelve -1 significa que el id es de un producto sin añadir. Si coincide el prodcto fue aladido
  //  6. Define una variable local para almacenar la cantidad correspondiente utilizando el id
  //  del producto para encontrar el documento seleccionado dentro del listado producto seleccionado
  //  7. Una vez se encuentra el indice del producto seleccionado y se modifica la cantidad
  //  se elimina el registro actual de ese producto seleccionado con el metodo splice()
  // 8. Se hace el push del producto seleccionado con el valor más reciente de cantidad seleccionada
  // 9. Se guarda en localStorage bajo la clave de selectedProducts
  saveSelectionToLocalStorage(): void {
    const storedProducts: any = [];
    this.products.forEach((product) => {
      if (product.id && product.quantity) {
        const storedProduct = { id: product.id, quantity: product.quantity };

        // Check if the product is already stored
        const storedIndex = this.getStoredProductIndex(product.id);
        if (storedIndex !== -1) {
          // If the product is already stored, update the quantity
          const storedProductQuantity = storedProducts[storedIndex].quantity;
          storedProduct.quantity += storedProductQuantity;
          storedProducts.splice(storedIndex, 1); // Remove the existing stored product
        }

        storedProducts.push(storedProduct);
      }
    });
    localStorage.setItem('selectedProducts', JSON.stringify(storedProducts));
  }
  // 1. Se recibe el listado de productos seleccionados del localStorage
  // 2. Solo cuando exista el listado se parsea a objeto JSON para obtener los productos guardados
  // 3. El nuevo listado de productos guardadosen formato JSON se itera para asignar las cantidades
  // 4. cuando la instancia de producto seleccionado no existe en el listado de productos almacenados
  // se añade como un nuevo producto almacenado

  loadSelectionFromLocalStorage(): void {
    const selectedProducts = localStorage.getItem('selectedProducts');
    if (selectedProducts) {
      const storedProducts = JSON.parse(selectedProducts);

      storedProducts.forEach((storedProduct: any) => {
        const product = this.products.find((p) => p.id === storedProduct.id);
        if (product) {
          product.quantity = storedProduct.quantity;
        } else {
          this.products.push(storedProduct);
        }
      });
    }
  }
}
