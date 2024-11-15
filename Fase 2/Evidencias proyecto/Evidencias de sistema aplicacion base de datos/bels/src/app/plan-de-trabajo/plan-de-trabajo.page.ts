import { Component, OnInit } from '@angular/core';
import { planesTrabajo, preguntasPlanes } from '../Modelo/tareas.model';
import { ModalController, ModalOptions } from '@ionic/angular';
import { VerActividadesComponent } from '../componentes/ver-actividades/ver-actividades.component';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-plan-de-trabajo',
  templateUrl: './plan-de-trabajo.page.html',
  styleUrls: ['./plan-de-trabajo.page.scss'],
})
export class PlanDeTrabajoPage implements OnInit {
  public planesTrabajos: planesTrabajo[] = []; // Arreglo para almacenar los planes de trabajo

  constructor(
    private modalController: ModalController,
    private firebaseService: FirebaseService
  ) { }

  async ngOnInit() {
    try {
      const usuarioId = await this.firebaseService.obtenerIdUsuarioDocumento();

      if (usuarioId) {
        const ultimoPlan = await this.firebaseService.obtenerUltimoPlanTrabajo(usuarioId);

        if (ultimoPlan) {
          // Accede a las propiedades usando corchetes e incluye horaRecomendacion
          this.planesTrabajos = [
            {
              idGrupo: ultimoPlan['idGrupo'],
              titulo: ultimoPlan['Grupo'],
              descripcion: "Incluye hábitos como una buena alimentación, ejercicio, descanso y gestión del estrés.", // Personaliza si es necesario
              preguntasPlanes: ultimoPlan['preguntasPlanes'].map((p: { plan: string, horaRecomendacion: string }) => ({
                plan: p['plan'],
                horaRecomendacion: p['horaRecomendacion'], // Incluimos horaRecomendacion aquí
                completo: false, // Inicializamos "completo" como false
              })),
            },
          ];
          
          // Verificar si `horaRecomendacion` fue traído correctamente
          console.log("Planes de trabajo con horaRecomendacion:", this.planesTrabajos);
        } else {
          console.warn('No se pudo obtener el último plan de trabajo.');
        }
      } else {
        console.warn('Usuario no autenticado.');
      }
    } catch (error) {
      console.error('Error al inicializar el componente:', error);
    }
  }

  async abrirModal() {
    if (this.planesTrabajos.length > 0) {
      const modal = await this.modalController.create({
        component: VerActividadesComponent,
        componentProps: {
          planesTrabajo: this.planesTrabajos[0], // Pasar el plan de trabajo al modal
        },
      });

      await modal.present();
    } else {
      console.warn('No hay planes de trabajo disponibles para mostrar.');
    }
  }

  obtenerPorcentaje(planesTrabajo: planesTrabajo): number {
    const actividadesCompletadas = planesTrabajo.preguntasPlanes.filter(
      (pregunta) => pregunta.completo
    ).length;
    const totalActividades = planesTrabajo.preguntasPlanes.length;
    return Math.floor((actividadesCompletadas / totalActividades) * 100); // Calculamos el porcentaje completado
  }

  async presentModal(opts: ModalOptions) {
    const modal = await this.modalController.create(opts);
    await modal.present();
    const { data } = await modal.onWillDismiss();
    return data;
  }

  dismissModal(data: any) {
    this.modalController.dismiss(data);
  }

  verTarea(planesTrabajo?: planesTrabajo) {
    this.presentModal({
      component: VerActividadesComponent,
      componentProps: { planesTrabajo },
    });
  }
}
