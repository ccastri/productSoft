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
// private currencyPipe: CurrencyPipe,
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;
  isOpen = false;
  amountToAdd: number = 0; // Add this line to define the amountToAdd property
  amountToDecrease: number = 0; // Add this line to define the amountToAdd property
  // productForm!: FormGroup;
  selectedProduct: Product | undefined;
  isSelected?: boolean;
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
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    // !Toma el primer
    this.productService
      .getProducts()
      .pipe(take(1))
      .subscribe((products) => {
        // console.log(products);
        this.products = products;
      });
    this.currentInvoice = this.invoiceService.currentInvoice;
    if (!this.currentInvoice) {
      // Load the currentInvoice from localStorage if it's not already set
      this.invoiceService.loadInvoiceFromLocalStorage();
      this.currentInvoice = this.invoiceService.currentInvoice;
    }
  }
  addProductsToInvoice() {
    const selectedProducts = this.invoiceService.getSelectedProducts(
      this.products
    );
    for (const product of selectedProducts) {
      if (product.id && product.quantity) {
        // Add a null check for product.id
        this.invoiceService
          .addProductToInvoice(product.id, this.products, product.quantity)
          .subscribe(
            () => {
              // Success handling, if needed
              this.currentInvoice = this.invoiceService.currentInvoice;
              console.log(this.currentInvoice);
              console.log('ok product has been added ');
            },
            (error) => {
              console.error(error);
              // Error handling, if needed
            }
          );
      }
    }
    console.log(selectedProducts);
    // Perform any necessary actions with the selected products
  }

  getSelectedProductQuantity(productId: string): number {
    return this.invoiceService.getSelectedProductQuantity(
      this.products,
      productId
    );
  }

  getNumberArray(stock: number): number[] {
    return Array(stock)
      .fill(0)
      .map((x, i) => i + 1);
  }

  removeFromInvoice(index: number): void {
    if (this.currentInvoice) {
      this.currentInvoice.items.splice(index, 1);
      // this.currentInvoice.total = this.calculateTotal();
      this.invoiceService.updateInvoice(this.currentInvoice);
    }
  }
}
