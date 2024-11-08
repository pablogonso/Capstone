import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ver-actividades',
  templateUrl: './ver-actividades.component.html',
  styleUrls: ['./ver-actividades.component.scss'],
})
export class VerActividadesComponent implements OnInit {
  @Input() planesTrabajo: any;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    console.log(this.planesTrabajo);  // Aquí puedes ver los datos de la categoría
  }

  cerrarModal() {
    this.modalController.dismiss(); // Cierra el modal sin enviar datos
  }
}