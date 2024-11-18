import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from '../../services/firebase.service';

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

  constructor(
    private modalController: ModalController,
    private firebaseService: FirebaseService
  ) {}

  async ngOnInit() {
    // Carga inicial similar al código actual
    if (!this.planesTrabajo || !this.planesTrabajo.idUsuario) {
      console.warn('El plan de trabajo no tiene un ID de usuario válido.');
      return;
    }

    const ultimoRegistro = await this.firebaseService.obtenerUltimoRegistroActividades(
      this.planesTrabajo.idUsuario
    );

    if (ultimoRegistro && ultimoRegistro.ActividadesRealizadas) {
      this.clasificarActividades(ultimoRegistro.ActividadesRealizadas);
    }
  }

  clasificarActividades(actividades: any[]) {
    actividades.forEach((actividad: any) => {
      actividad.plan = actividad.Actividad; // Mapear campos
      actividad.completo = actividad.Completo;

      if (typeof actividad.horaRecomendacion === 'string') {
        const hora = parseInt(actividad.horaRecomendacion.split(':')[0], 10);

        if (hora >= 5 && hora < 12) {
          this.actividadesManana.push(actividad);
        } else if (hora >= 12 && hora < 18) {
          this.actividadesTarde.push(actividad);
        } else {
          this.actividadesNoche.push(actividad);
        }
      }
    });
  }

  async guardarCambios() {
    try {
      const todasLasActividades = [
        ...this.actividadesManana,
        ...this.actividadesTarde,
        ...this.actividadesNoche,
      ];
  
      // Actualiza el estado de las actividades en Firebase
      await this.firebaseService.actualizarActividades(
        this.planesTrabajo.idUsuario,
        todasLasActividades
      );
  
      console.log('Cambios guardados correctamente.');
  
      // Cierra el modal y notifica al componente principal
      this.cerrarModal(true); // Indica que los datos se actualizaron
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  }
  

  cerrarModal(actualizado: boolean = false) {
    this.modalController.dismiss({ actualizado });
  }
}
