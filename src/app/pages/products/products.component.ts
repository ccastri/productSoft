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
      });
  }
  loadSelectedProduct(productId: string) {
    this.productService.getProductById(productId).subscribe(
      (product) => {
        if (product) {
          this.selectedProduct = product;

          if (this.selectedProduct.stockAmount <= 10) {
            // console.log('aqui toy');
            Swal.fire('Alert', 'Stock amount is less than 10', 'warning');
          }
        } else {
          console.error(`Product with id ${productId} not found`);
        }
      },
      (error) => {
        console.error('Error loading product:', error);
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
      console.error('Selected product not found');
      return;
    }

    // !------------------------------------------------------------------------------------------!
    // ! Here we cheked there's a product being clicked now we need
    // ! To realize the equal amount our product is attempting to updated

    // ! Since we got the matching product id, we can go ahead and update the document
    // !Being updated we're mapping through the array passed by produc
    // !------------------------------------------------------------------------------------------!

    try {
      this.selectedProduct.stockAmount += amount;

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
      console.log('Stock amount updated successfully!');
    } catch (error) {
      console.error('Error updating stock amount:', error);
    }
  }

  // !To open/close the visible/hidden form.

  toggleOpen() {
    this.isOpen = !this.isOpen;
    console.log(this.isOpen);
  }

  async decreaseProduct(id: string, amount: number): Promise<void> {
    if (amount <= 0) {
      Swal.fire('Error', 'Please enter a positive integer.', 'error');
      return;
    }

    const selectedProduct = this.products.find((product) => product.id === id);

    if (!selectedProduct) {
      console.error('Selected product not found');
      return;
    }

    if (amount > selectedProduct.stockAmount) {
      Swal.fire(
        'Error',
        'The amount to decrease is greater than the minimum available stock.',
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
    // console.log(product);
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

      Swal.fire('Success', 'Product added successfully!', 'success');
    } catch (error) {
      console.error('Error adding product:', error);
      Swal.fire('Error', 'Failed to add product', 'error');
    }
  }

  // !TODO:
  // !This is the next step Yesterday I was able to create a new product using this form
  // ! I was working on it's  validations
  // !But is pretty easy though

  // onSubmit() {
  //   if (this.productForm.invalid) {
  //     // Handle form validation errors
  //     return;
  //   }

  //   const formData = this.productForm.value;

  //   this.createProduct(formData);

  //   // Reset the form after submission
  //   this.productForm.reset();
  // }
}
