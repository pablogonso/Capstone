import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';

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
    private firebaseService: FirebaseService,
    private router: Router // Para redirigir a la página de felicitaciones
  ) {}

  async ngOnInit() {
    if (!this.planesTrabajo || !this.planesTrabajo.idUsuario) {
      console.warn('El plan de trabajo no tiene un ID de usuario válido.');
      return;
    }

    const ultimoRegistro = await this.firebaseService.obtenerUltimoRegistroActividades(
      this.planesTrabajo.idUsuario
    );

    if (ultimoRegistro && ultimoRegistro.data.ActividadesRealizadas) {
      this.clasificarActividades(ultimoRegistro.data.ActividadesRealizadas);
    }
  }

  clasificarActividades(actividades: any[]) {
    actividades.forEach((actividad: any) => {
      actividad.plan = actividad.Actividad; // Mapear campos
      actividad.Completo = actividad.Completo;

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

      const actividadesValidas = todasLasActividades.filter((actividad) =>
        actividad.Actividad && typeof actividad.Completo === 'boolean'
      );

      if (actividadesValidas.length === 0) {
        console.warn('No hay actividades válidas para guardar.');
        return;
      }

      // Actualiza las actividades en Firebase
      await this.firebaseService.actualizarActividades(
        this.planesTrabajo.idUsuario,
        actividadesValidas
      );

      console.log('Cambios guardados correctamente.');

      // Verifica si es el día de corte y realiza la lógica del corte
      const esDiaDeCorte = await this.verificarDiaDeCorte();

      if (esDiaDeCorte) {
        console.log('Es día de corte. Verificando actividades completadas...');
        const todasCompletadas = await this.firebaseService.verificarActividadesCompletadas(
          this.planesTrabajo.idUsuario
        );

        if (todasCompletadas) {
          console.log('Todas las actividades están completadas. Actualizando plan...');
          const planActualizado = await this.firebaseService.actualizarPlanCompletado(
            this.planesTrabajo.idUsuario
          );

          if (planActualizado) {
            console.log('Plan completado con éxito. Verificando grupo actual...');
            const grupoActual = this.planesTrabajo.titulo; // Obtiene el grupo desde el plan de trabajo
      
            if (grupoActual === 'Relaciones Sociales') {
              console.log(`Grupo actual: ${grupoActual}. Redirigiendo a /felicitaciones-final...`);
              this.router.navigate(['/felicitaciones-final']); // Redirige a la página de felicitaciones final
            } else {
              console.log(`Grupo actual: ${grupoActual}. Redirigiendo a /felicitaciones...`);
              this.router.navigate(['/felicitaciones']); // Redirige a la página de felicitaciones estándar
            }
          } else {
            console.warn('No se pudo actualizar el plan como completado.');
          }
        } else {
          console.log('No todas las actividades están completadas.');
        }
      } else {
        console.log('Hoy no es día de corte.');
      }

      // Cierra el modal
      this.cerrarModal(true);
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  }

  async verificarDiaDeCorte(): Promise<boolean> {
    const hoy = new Date();
    const diaActual = hoy.toLocaleDateString('es-ES', { weekday: 'long' }); // Obtiene el día en español
    const diaCorte = await this.firebaseService.obtenerDiaDeCorte(); // Obtiene el día de corte desde el servicio
    return diaActual.toLowerCase() === diaCorte.toLowerCase(); // Compara ignorando mayúsculas/minúsculas
  }
  

  cerrarModal(actualizado: boolean = false) {
    this.modalController.dismiss({ actualizado });
  }
}
