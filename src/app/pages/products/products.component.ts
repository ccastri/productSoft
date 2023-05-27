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
// private currencyPipe: CurrencyPipe,
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;
  isOpen = false;
  amountToAdd: number = 0; // Add this line to define the amountToAdd property
  amountToDecrease: number = 0; // Add this line to define the amountToAdd property
  // productForm!: FormGroup;
  selectedProduct: Product | undefined;

  // !Formulario para creat nuevos productos con los campos requeridos
  public formSubmitted = false;
  public productForm = this.fb.group({
    make: ['', Validators.required],
    model: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, Validators.required],
    stockAmount: [0, Validators.required],
    OS: ['', Validators.required],
    disadvantage: ['', Validators.required],
    screenSize: ['', Validators.required],
    stockCode: ['', Validators.required],
  });
  constructor(public productService: ProductService, private fb: FormBuilder) {}

  ngOnInit(): void {
    // !Toma el primer valor
    // TODO: Convertirlo en una variable tipo this.loadProducts()
    this.productService
      .getProducts()
      .pipe(take(1))
      .subscribe((products) => {
        console.log(products);
        this.products = products;
        this.isLoading = false;
      });
  }

  // !Helper to get the ID from the firebase doc:
  // !You gotta wait for the id from the pressed HTML button
  // !Which seems to give you a promise type IProduct or undefined when
  // !Just listening and nothing has been yet clicked.
  // !Also it's being called by the addProduct method when the user clicks
  loadSelectedProduct(productId: string) {
    this.productService.getProductById(productId).subscribe(
      (product) => {
        if (product) {
          this.selectedProduct = product;
        } else {
          console.error(`Producto con id ${productId} no encontradp`);
        }
      },
      (error) => {
        console.error('Error cargando producto:', error);
      }
    );
  }
  //! ---------------- Trata de actualizar el stock del produto seleccionado-----------------------!
  //! 1. Asigna la propiedad de la cantidad en selectedProduct
  //!    al valor que tenga el selector de cantidad del cliente html.
  //! 2.para actualizar el producto dentro del array de productos mapea entre el arreglo
  //! 3. si el id corresponde a algun producto de la lista de productos
  //!    Va a ser el elemento seleccionado y podemos renderizar el valor actualizado del amount
  //! 4 Sino, devuelva el producto de la lista de productos tal cual como viene
  //! 5. Filtre cada producto para ver si es diferente a indefinido como un arreglo de productos
  //! 6. Ya que las verificaciones de tipado estricto pasaron, la variable updatedProducts puede
  //!  Actualizar la nueva cantidad de acuerdo al producto que ha sido seleccionado
  async addProduct(id: string, amount: number): Promise<void> {
    await this.loadSelectedProduct(id);
    if (!this.selectedProduct) {
      console.error('Producto seleccionado no encontrado');
      return;
    }
    try {
      this.selectedProduct.stockAmount += +amount;
      const updatedProducts = this.products
        .map((product) => {
          if (product.id === id) {
            return this.selectedProduct;
          }
          return product;
        })
        .filter((product) => product !== undefined) as Product[];
      this.products = updatedProducts;
      await this.productService.updateProduct(this.selectedProduct);

      // Swal.fire(
      //   'Cambios aplicados',
      //   'Inventario actualizado correctamente',
      //   'success'
      // );
      console.log('Inventario actualizado con exito!');
    } catch (error) {
      console.error('Error actualizando la cantidad de inventario:', error);
    }
  }
  //! ---------------- Trata de actualizar el stock del produto seleccionado-----------------------!
  //******************************* Condiciones***********************************************//
  //! 1. Confirmamos que la cantidad ingresada sea un numero entero positivo
  //! 2. Confirmamos que el id del producto seleccionado se encuentre en la colección
  //! 3. Cuando el stock del producto está por debajo de 10 no debe ser descontado
  //! 4. Si la cantidad a descontar el mayor que el stock del producto no debe ser descontado
  //******************Si el producto cumple todas condiciones puede ser modificado *********/
  //! 6. Llamar el metodo decreaseAmount del sevicio de productos para descontar la cantidad en stock
  //!    de acuerdo al valor que tenga el selector de cantidad del cliente html.
  //! 7. Se debe actualizar la variable local del stock del producto seleccionado con la nueva cantidad en stock
  async decreaseProduct(id: string, amount: number): Promise<void> {
    if (amount <= 0) {
      Swal.fire('Error', 'Cantidad no valida. Intente de nuevo', 'error');
      return;
    }
    const selectedProduct = this.products.find((product) => product.id === id);
    if (!selectedProduct) {
      console.error('Producto seleccionado no fue encontrado');
      return;
    }
    if (selectedProduct.stockAmount <= 10) {
      Swal.fire('Alert', 'No hay suficientes unidades disponibles', 'warning');
      return;
    }
    if (amount > selectedProduct.stockAmount) {
      Swal.fire(
        'Error',
        'Inventario insuficiente. Stock no disponible',
        'error'
      );
      return;
    }
    try {
      // Call the service method to decrease the stock amount in Firebase
      await this.productService.decreaseStockAmount(id, amount);

      // Update the local state of the Product object with the new stockAmount
      selectedProduct.stockAmount -= amount;

      // Swal.fire(
      //   'Cambios aplicados',
      //   'Inventario actualizado correctamente',
      //   'success'
      // );
      console.log('Stock amount updated successfully!');
    } catch (err) {
      console.error('Error removiendo productos:', err);
    }
  }

  // !This is to create a new product
  // !this receive the product details from the form fields
  // ! 1. Validar que el formulario esté completo
  // ! 2. Tipar el formulario como un objeto de tipo Product
  // ! 3. llamar el listado de productos desde el servicio, añadir la data
  // !    del nuevo producto ingresado
  // ! 4. Refrezcar el listado de productos
  async createProduct(): Promise<any> {
    this.formSubmitted = true;
    if (this.productForm.invalid) {
      // Display an error message or perform necessary actions when the form is invalid
      return;
    }
    const product: Product = this.productForm.value as Product;

    try {
      await this.productService.addProduct(product);
      this.productService
        .getProducts()
        .pipe(take(1))
        .subscribe((products) => {
          // console.log(products);
          this.products = products;
        });

      Swal.fire('Success', 'Producto añadido exitosamente!', 'success');
      this.productService.getProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      Swal.fire('Error', 'Fallo al añadir producto', 'error');
    }
  }
  // !Crear productos desde un listado de tipo Product[]
  // ! 1. iterar la lista de productos a añadir, asignar las propiedades que trae el listado producto por producto
  // ! 2. Por default asignar el isSelected en falso y las cantidades para modificar el stock en 0
  // ! 3. Convertir de objeto plano a JavaScript JSON representation
  // ! 4. Eliminar el default id ('') porque va a ser asignado por firebase automaticamente
  // ! 5. Añadir los productos a la coleccion
  // async createProducts(): Promise<any> {
  //   try {
  //     for (const item of itemList) {
  //       const product: Product = new Product(
  //         item.make,
  //         item.model,
  //         item.description,
  //         item.price,
  //         item.stockAmount,
  //         item.OS,
  //         item.disadvantage,
  //         item.screenSize,
  //         item.stockCode,
  //         '',
  //         false,
  //         0,
  //         0,
  //         0
  //       );

  //       const productData = { ...product }; // Convert Product object to plain JavaScript object
  //       delete productData.id; // Exclude the 'id' field

  //       await this.productService.addProduct(productData);
  //       await this.productService.getProducts();
  //     }

  //     Swal.fire('Success', 'Productos añadidos exitosamente!', 'success');
  //   } catch (error) {
  //     console.error('Error adding products:', error);
  //     Swal.fire('Error', 'Fallo al añadir productos', 'error');
  //   }
  // }
  // !To open/close the visible/hidden form.
  // TODO: Debe ser una propiedad del servicio del modal
  toggleOpen() {
    this.isOpen = !this.isOpen;
    console.log(this.isOpen);
  }
}
// Ejemplo de listado de productos: el isSelected no es necesario
// const itemList: Product[] = [
//   {
//     make: 'Apple',
//     model: 'MacBook Pro',
//     description: 'Powerful laptop for developers',
//     price: 1999,
//     stockAmount: 50,
//     OS: 'macOS',
//     disadvantage: 'High price',
//     screenSize: '13 inches',
//     isSelected: false,
//     stockCode: 'MBP-001',
//   },
//   {
//     make: 'Dell',
//     model: 'XPS 13',
//     description: 'Thin and lightweight laptop with great performance',
//     price: 1499,
//     stockAmount: 30,
//     OS: 'Windows 10',
//     disadvantage: 'Limited ports',
//     screenSize: '13 inches',
//     isSelected: false,
//     stockCode: 'XPS-001',
//   },
//   {
//     make: 'Lenovo',
//     model: 'ThinkPad X1 Carbon',
//     description: 'Durable business laptop with excellent keyboard',
//     price: 1699,
//     stockAmount: 25,
//     OS: 'Windows 10',
//     disadvantage: 'Relatively expensive',
//     screenSize: '14 inches',
//     isSelected: false,
//     stockCode: 'TPX1C-001',
//   },
//   {
//     make: 'HP',
//     model: 'Spectre x360',
//     description: 'Convertible laptop with stylish design',
//     price: 1299,
//     stockAmount: 35,
//     OS: 'Windows 10',
//     disadvantage: 'Average battery life',
//     screenSize: '13 inches',
//     isSelected: false,
//     stockCode: 'SPECTRE-001',
//   },
//   {
//     make: 'Microsoft',
//     model: 'Surface Laptop 4',
//     description: 'Sleek and powerful laptop with excellent display',
//     price: 1599,
//     stockAmount: 20,
//     OS: 'Windows 10',
//     disadvantage: 'Limited upgrade options',
//     screenSize: '15 inches',
//     isSelected: false,
//     stockCode: 'SURFACE-001',
//   },
//   {
//     make: 'Asus',
//     model: 'ZenBook 14',
//     description: 'Compact laptop with great performance',
//     price: 1099,
//     stockAmount: 40,
//     OS: 'Windows 10',
//     disadvantage: 'Lacks Thunderbolt 3 ports',
//     screenSize: '14 inches',
//     isSelected: false,
//     stockCode: 'ZENBOOK-001',
//   },
//   {
//     make: 'Acer',
//     model: 'Swift 3',
//     description: 'Affordable and lightweight laptop for everyday use',
//     price: 799,
//     stockAmount: 50,
//     OS: 'Windows 10',
//     disadvantage: 'Average build quality',
//     screenSize: '14 inches',
//     isSelected: false,
//     stockCode: 'SWIFT-001',
//   },
//   {
//     make: 'Razer',
//     model: 'Blade 15',
//     description: 'Gaming laptop with powerful specifications',
//     price: 2199,
//     stockAmount: 15,
//     OS: 'Windows 10',
//     disadvantage: 'Expensive for non-gaming use',
//     screenSize: '15 inches',
//     isSelected: false,
//     stockCode: 'BLADE15-001',
//   },
//   {
//     make: 'Google',
//     model: 'Pixelbook Go',
//     description: 'Chromebook with long battery life and lightweight design',
//     price: 999,
//     stockAmount: 20,
//     OS: 'Chrome OS',
//     disadvantage: 'Limited software compatibility',
//     screenSize: '13 inches',
//     isSelected: false,
//     stockCode: 'PIXELBOOKGO-001',
//   },
// ];
