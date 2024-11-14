import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ver-actividades',
  templateUrl: './ver-actividades.component.html',
  styleUrls: ['./ver-actividades.component.scss'],
})
export class VerActividadesComponent implements OnInit {
  @Input() planesTrabajo: any; // Recibimos el plan de trabajo

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    console.log(this.planesTrabajo); // Verifica los datos que llegan al modal
  }

  cerrarModal() {
    this.modalController.dismiss(); // Cierra el modal
  }
}
