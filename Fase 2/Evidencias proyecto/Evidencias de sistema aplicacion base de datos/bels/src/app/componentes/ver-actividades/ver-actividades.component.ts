import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ver-actividades',
  templateUrl: './ver-actividades.component.html',
  styleUrls: ['./ver-actividades.component.scss'],
})
export class VerActividadesComponent implements OnInit {
  @Input() categoria: any;

  constructor() { }

  ngOnInit() {
    console.log(this.categoria);  // Aquí puedes ver los datos de la categoría
  }
}