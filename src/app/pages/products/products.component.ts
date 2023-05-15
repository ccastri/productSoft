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
  productForm!: FormGroup;

  constructor(public productService: ProductService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.productService
      .getProducts()
      .pipe(take(1))
      .subscribe((products) => {
        console.log(products);
        this.products = products;
      });

    this.productForm = this.fb.group({
      make: ['', Validators.required],
      model: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      stockAmount: ['', Validators.required],
      OS: ['', Validators.required],
      disadvantage: ['', Validators.required],
      screenSize: ['', Validators.required],
      stockCode: ['', Validators.required],
    });
  }
  // addProduct(id: string, amount: number): void {
  //   this.productService.addStockAmount(id, amount);
  // }
  async addProduct(id: string, amount: number): Promise<void> {
    if (this.amountToAdd <= 0) {
      Swal.fire(
        'Error',
        'Por favor ingrese un numero entero positivo.',
        'error'
      );
      return;
    }
    try {
      await this.productService.addStockAmount(id, amount);
      Swal.fire(
        'Cambios aplicados',
        'Inventario actualizado correctamente',
        'success'
      );
      console.log('Stock amount updated successfully!');
    } catch (err) {
      console.error('Error adding product:', err);
    }
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
    console.log(this.isOpen);
  }

  async decreaseProduct(id: string, amount: number): Promise<void> {
    if (this.amountToDecrease <= 0) {
      Swal.fire('Error', 'Please enter a positive integer.', 'error');
      return;
    }
    try {
      await this.productService.decreaseStockAmount(id, amount);
      Swal.fire(
        'Cambios aplicados',
        'Inventario actualizado correctamente',
        'success'
      );
      console.log('Stock amount decreased successfully!');
    } catch (err) {
      console.error('Error removing products:', err);
    }
  }
  async createProduct(product: Product): Promise<any> {
    try {
      await this.productService.addProduct(product);
      Swal.fire('Success', 'Product added successfully!', 'success');
    } catch (error) {
      console.error('Error adding product:', error);
      Swal.fire('Error', 'Failed to add product', 'error');
    }
  }

  onSubmit() {
    if (this.productForm.invalid) {
      // Handle form validation errors
      return;
    }

    const formData = this.productForm.value;

    this.createProduct(formData);

    // Reset the form after submission
    this.productForm.reset();
  }
}
