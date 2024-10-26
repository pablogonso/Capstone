import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ver-actividades',
  templateUrl: './ver-actividades.component.html',
  styleUrls: ['./ver-actividades.component.scss'],
})
export class VerActividadesComponent implements OnInit {
  @Input() categoria: any;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    console.log(this.categoria);  // Aquí puedes ver los datos de la categoría
  }

  cerrarModal() {
    this.modalController.dismiss(); // Cierra el modal sin enviar datos
  }
}