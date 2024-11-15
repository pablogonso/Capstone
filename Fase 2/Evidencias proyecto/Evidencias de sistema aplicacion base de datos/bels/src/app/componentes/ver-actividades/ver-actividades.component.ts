import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ver-actividades',
  templateUrl: './ver-actividades.component.html',
  styleUrls: ['./ver-actividades.component.scss'],
})
export class VerActividadesComponent implements OnInit {
  @Input() planesTrabajo: any; // Recibimos el plan de trabajo

  actividadesManana: any[] = [];
  actividadesTarde: any[] = [];
  actividadesNoche: any[] = [];

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    // Verifica que `planesTrabajo` y `preguntasPlanes` están definidos
    if (this.planesTrabajo && this.planesTrabajo.preguntasPlanes) {
      this.clasificarActividades(); // Llama a la función de clasificación
    } else {
      console.warn("planesTrabajo o preguntasPlanes no están definidos correctamente.");
    }
  }

  clasificarActividades() {
    this.planesTrabajo.preguntasPlanes.forEach((actividad: any) => {
      // Verifica que `horaRecomendacion` exista y esté en el formato esperado
      if (typeof actividad.horaRecomendacion === 'string') {
        const hora = parseInt(actividad.horaRecomendacion.split(':')[0], 10);

        // Clasificación según la hora
        if (!isNaN(hora)) {
          if (hora >= 5 && hora < 12) {
            this.actividadesManana.push(actividad);
          } else if (hora >= 12 && hora < 18) {
            this.actividadesTarde.push(actividad);
          } else {
            this.actividadesNoche.push(actividad);
          }
        } else {
          console.warn("Hora no válida en actividad:", actividad);
        }
      } else {
        console.warn("horaRecomendacion no está presente o no es una cadena en actividad:", actividad);
      }
    });

    // Imprime los resultados para verificar la clasificación
    console.log("Actividades Mañana:", this.actividadesManana);
    console.log("Actividades Tarde:", this.actividadesTarde);
    console.log("Actividades Noche:", this.actividadesNoche);
  }

  cerrarModal() {
    this.modalController.dismiss(); // Cierra el modal
  }
}
