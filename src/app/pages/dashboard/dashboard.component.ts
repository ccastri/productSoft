import { Component, OnInit } from '@angular/core';
// import { ModalFormComponent } from 'src/app/components/modal-form/modal-form.component';
import { Invoice, InvoiceService } from 'src/app/services/invoice.service';
// import { ModalImageCom}ponent } from 'src/app/components/modal-form/modal-form.component';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { ProductService } from 'src/app/services/product.service';
import { take } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { slideInAnimation } from '../animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [slideInAnimation],
})
export class DashboardComponent implements OnInit {
  public isLoading: boolean = true;
  currentInvoice: Invoice | undefined = {
    id: '',
    items: [],
    subtotal: 0,
    cliente: '',
    vendedor: '',
    direccion: '',
    email: '',
    moneda: '',
  };
  products: Product[] = [];
  data3: any = [];
  constructor(
    public invoiceService: InvoiceService,
    public productService: ProductService
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
        // const filteredProducts = products.filter((product) => {
        //   return !product.stockAmount || product.stockAmount <= 0;
        // });
        // this.products = [];
        this.products = products;
        this.setupChart();
        // this.loadSelectionFromLocalStorage();

        // ! Carga los productos seleccionados
      });
    this.currentInvoice = this.invoiceService.currentInvoice;
    if (!this.currentInvoice) {
      // Load the currentInvoice from localStorage if it's not already set
      this.invoiceService.loadInvoiceFromLocalStorage();
      this.currentInvoice = this.invoiceService.currentInvoice;
      // !this.isModalOpen;
    }
  }
  setupChart() {
    // data3 = []
    // this.data = this.products.map((product) => ({
    this.data3 = this.products.map((product) => ({
      name: product.make,
      value: product.stockAmount,
    }));
  }
  view: [number, number] = [380, 150]; // Dimensiones del gráfico
  colorScheme = 'cool'; // Esquema de colores
  data = [
    { name: 'R1', value: 300 },
    { name: 'R2', value: 500 },
    { name: 'R3', value: 531 },
    { name: 'R4', value: 189 },
    { name: 'R5', value: 45 },
    // ...
  ];

  onSelect(event: any) {
    // Acción a realizar cuando se selecciona una porción del gráfico
  }
  view2: [number, number] = [380, 200]; // Tamaño del gráfico

  // Datos para el gráfico
  data2 = [
    { name: 'Enero', value: 10 },
    { name: 'Febrero', value: 15 },
    { name: 'Marzo', value: 8 },
    { name: 'Abril', value: 12 },
    { name: 'Mayo', value: 20 },
    // Agrega más datos si es necesario
  ];

  // Configuración del gráfico
  showXAxis = true;
  showYAxis = true;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Meses';
  yAxisLabel = '# Afiliados';
  xAxisLabel3 = 'Productos';
  yAxisLabel3 = '# Stock';

  // Esquema de colores para las barras
  colorScheme2: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454'], // Customize your colors here
  };
}
