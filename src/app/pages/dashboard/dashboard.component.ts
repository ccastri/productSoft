import { Component, OnInit } from '@angular/core';
// import { ModalFormComponent } from 'src/app/components/modal-form/modal-form.component';
import { InvoiceService } from 'src/app/services/invoice.service';
// import { ModalImageCom}ponent } from 'src/app/components/modal-form/modal-form.component';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public isLoading: boolean = true;
  constructor(public invoiceService: InvoiceService) {}
  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
  view: [number, number] = [600, 300]; // Dimensiones del gráfico
  colorScheme = 'cool'; // Esquema de colores
  data = [
    { name: 'Riesgo 1', value: 300 },
    { name: 'Riesgo 2', value: 500 },
    { name: 'Riesgo 3', value: 531 },
    { name: 'Riesgo 4', value: 189 },
    { name: 'Riesgo 5', value: 45 },
    // ...
  ];

  onSelect(event: any) {
    // Acción a realizar cuando se selecciona una porción del gráfico
  }
  view2: [number, number] = [500, 300]; // Tamaño del gráfico

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

  // Esquema de colores para las barras
  colorScheme2: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454'], // Customize your colors here
  };
}
