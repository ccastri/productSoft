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
    // !Toma el primer
    this.productService
      .getProducts()
      .pipe(take(1))
      .subscribe((products) => {
        // console.log(products);
        this.products = products;
        this.isLoading = false;
      });
  }
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
  // addProduct(id: string, amount: number): void {
  //   this.productService.addStockAmount(id, amount);
  // }
  // !Helper to get the ID from the firebase doc:
  // !You gotta wait for the id from the pressed HTML button
  // !Which seems to give you a promise type IProduct or undefined when
  // !Just listening and nothing has been yet clicked.
  // !Also it's being called by the addProduct method when the user clicks

  // !--------------Read the entire explanation UBOVE-----------------------!
  // !--------------Read the entire explanation UBOVE-----------------------!
  // !--------------Read the entire explanation UBOVE-----------------------!

  // async loadSelectedProduct(productId: string) {
  //   console.log(productId);
  //   try {
  //     const product = await this.productService
  //       .getProductById(productId)
  //       .toPromise();
  //     console.log(product);
  //     if (product) {
  //       this.selectedProduct = product;
  //       console.log(this.selectedProduct);
  //     } else {
  //       console.error(`Product with id ${productId} not found`);
  //     }
  //   } catch (error) {
  //     console.error('Error loading product:', error);
  //   }
  // }
  //! At first we're gettting the id from the pressed + button
  // ! at the matching row. secondly you have to set the first value (undefined by default)
  async addProduct(id: string, amount: number): Promise<void> {
    await this.loadSelectedProduct(id);

    // Esta funcion entra al siguiente if y selectedProduct da undefined en vez de el id del documento de firebase que estoy queriendo aumentar
    console.log(this.selectedProduct);
    if (!this.selectedProduct) {
      console.error('Producto seleccionado no encontrado');
      return;
    }

    // !------------------------------------------------------------------------------------------!
    // ! Here we cheked there's a product being clicked now we need
    // ! To realize the equal amount our product is attempting to be updated

    // ! Since we got the matching product id, we can go ahead and update the document
    // !Being updated we're mapping through the array passed by produc
    // !------------------------------------------------------------------------------------------!

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

  // !To open/close the visible/hidden form.

  toggleOpen() {
    this.isOpen = !this.isOpen;
    console.log(this.isOpen);
  }

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
    } catch (error) {
      console.error('Error adding product:', error);
      Swal.fire('Error', 'Fallo al añadir producto', 'error');
    }
  }

  async createProducts(): Promise<any> {
    try {
      for (const item of itemList) {
        const product: Product = new Product(
          item.make,
          item.model,
          item.description,
          item.price,
          item.stockAmount,
          item.OS,
          item.disadvantage,
          item.screenSize,
          item.stockCode,
          '',
          false,
          0,
          0,
          0
        );

        const productData = { ...product }; // Convert Product object to plain JavaScript object
        delete productData.id; // Exclude the 'id' field

        await this.productService.addProduct(productData);
      }

      Swal.fire('Success', 'Productos añadidos exitosamente!', 'success');
    } catch (error) {
      console.error('Error adding products:', error);
      Swal.fire('Error', 'Fallo al añadir productos', 'error');
    }
  }
}

const itemList: Product[] = [
  {
    make: 'Apple',
    model: 'MacBook Pro',
    description: 'Powerful laptop for developers',
    price: 1999,
    stockAmount: 50,
    OS: 'macOS',
    disadvantage: 'High price',
    screenSize: '13 inches',
    isSelected: false,
    stockCode: 'MBP-001',
  },
  {
    make: 'Dell',
    model: 'XPS 13',
    description: 'Thin and lightweight laptop with great performance',
    price: 1499,
    stockAmount: 30,
    OS: 'Windows 10',
    disadvantage: 'Limited ports',
    screenSize: '13 inches',
    isSelected: false,
    stockCode: 'XPS-001',
  },
  {
    make: 'Lenovo',
    model: 'ThinkPad X1 Carbon',
    description: 'Durable business laptop with excellent keyboard',
    price: 1699,
    stockAmount: 25,
    OS: 'Windows 10',
    disadvantage: 'Relatively expensive',
    screenSize: '14 inches',
    isSelected: false,
    stockCode: 'TPX1C-001',
  },
  {
    make: 'HP',
    model: 'Spectre x360',
    description: 'Convertible laptop with stylish design',
    price: 1299,
    stockAmount: 35,
    OS: 'Windows 10',
    disadvantage: 'Average battery life',
    screenSize: '13 inches',
    isSelected: false,
    stockCode: 'SPECTRE-001',
  },
  {
    make: 'Microsoft',
    model: 'Surface Laptop 4',
    description: 'Sleek and powerful laptop with excellent display',
    price: 1599,
    stockAmount: 20,
    OS: 'Windows 10',
    disadvantage: 'Limited upgrade options',
    screenSize: '15 inches',
    isSelected: false,
    stockCode: 'SURFACE-001',
  },
  {
    make: 'Asus',
    model: 'ZenBook 14',
    description: 'Compact laptop with great performance',
    price: 1099,
    stockAmount: 40,
    OS: 'Windows 10',
    disadvantage: 'Lacks Thunderbolt 3 ports',
    screenSize: '14 inches',
    isSelected: false,
    stockCode: 'ZENBOOK-001',
  },
  {
    make: 'Acer',
    model: 'Swift 3',
    description: 'Affordable and lightweight laptop for everyday use',
    price: 799,
    stockAmount: 50,
    OS: 'Windows 10',
    disadvantage: 'Average build quality',
    screenSize: '14 inches',
    isSelected: false,
    stockCode: 'SWIFT-001',
  },
  {
    make: 'Razer',
    model: 'Blade 15',
    description: 'Gaming laptop with powerful specifications',
    price: 2199,
    stockAmount: 15,
    OS: 'Windows 10',
    disadvantage: 'Expensive for non-gaming use',
    screenSize: '15 inches',
    isSelected: false,
    stockCode: 'BLADE15-001',
  },
  {
    make: 'Google',
    model: 'Pixelbook Go',
    description: 'Chromebook with long battery life and lightweight design',
    price: 999,
    stockAmount: 20,
    OS: 'Chrome OS',
    disadvantage: 'Limited software compatibility',
    screenSize: '13 inches',
    isSelected: false,
    stockCode: 'PIXELBOOKGO-001',
  },
];
