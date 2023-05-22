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
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
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
  // ************** !Aqui se ejecuta el proceso para añadir los productos:¡**************//
  // 1. se define una constante que almacene arreglo de los productos seleccionados: selectedProducts
  // 2. para cada producto seleccionado se añade a la factura
  addProductsToInvoice() {
    const selectedProducts = this.invoiceService.getSelectedProducts(
      this.products
    );
    for (const product of selectedProducts) {
      if (product.id && product.quantity) {
        // Add a null check for product.id and product quantity
        this.invoiceService
          // !*********************************!
          // !Need to add the         *********!
          // !new props for the       *********!
          // !detailed bill           *********!
          // !*********************************!
          .addProductToInvoice(product.id, this.products, product.quantity)
          .subscribe(
            () => {
              // Success handling, if needed
              this.currentInvoice = this.invoiceService.currentInvoice;
              console.log(this.currentInvoice);
              // this.removeFromInvoice;
              // this.invoiceService.clearInvoiceFromLocalStorage
              this.toggleModal();
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
      this.toggleModal();
    }
  }
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

  toggleModal() {
    const selectedProducts = this.invoiceService.getSelectedProducts(
      this.products
    );
    this.isModalOpen = !this.isModalOpen;
    // this.currentInvoice;
  }
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
}
