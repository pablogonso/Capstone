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
  ) {}

  async ngOnInit() {
    try {
      const usuarioId = await this.firebaseService.obtenerIdUsuarioDocumento();
  
      if (usuarioId) {
        const ultimoRegistro = await this.firebaseService.obtenerUltimoRegistroActividades(usuarioId);
  
        if (ultimoRegistro && ultimoRegistro.data.ActividadesRealizadas) {
          // Construimos el plan de trabajo basado en la colección
          this.planesTrabajos = [
            {
              idGrupo: 'ActividadesDiarias', // Identificador del grupo
              titulo: ultimoRegistro.data.Grupo || 'Sin Grupo', // Usamos el campo `Grupo` de la base de datos
              descripcion: 'Actividades registradas recientemente.', // Descripción personalizada
              preguntasPlanes: ultimoRegistro.data.ActividadesRealizadas.map(
                (actividad: { Actividad: string; Completo: boolean }) => ({
                  plan: actividad.Actividad,
                  Completo: actividad.Completo,
                })
              ),
              idUsuario: usuarioId, // Incluimos el ID del usuario aquí
            },
          ];
  
          console.log('Último registro cargado desde RegistroActividadesDiarias:', this.planesTrabajos);
        } else {
          console.warn('No se encontraron actividades para el usuario.');
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
          planesTrabajo: this.planesTrabajos[0], // Incluye el plan de trabajo completo
        },
      });
  
      // Espera hasta que el modal sea cerrado
      await modal.present();
  
      // Escucha el evento de cierre del modal
      const { data } = await modal.onDidDismiss();
  
      if (data && data.actualizado) {
        console.log('Cerrando modal y actualizando actividades...');
        await this.ngOnInit(); // Reejecuta la lógica de inicialización para refrescar los datos
      }
      
    } else {
      console.warn('No hay planes de trabajo disponibles para mostrar.');
    }
  }
  

  obtenerPorcentaje(planesTrabajo: planesTrabajo): number {
    if (!planesTrabajo || !planesTrabajo.preguntasPlanes) {
      console.warn('El plan de trabajo no contiene actividades válidas.');
      return 0;
    }
  
    const totalActividades = planesTrabajo.preguntasPlanes.length;
  
    if (totalActividades === 0) {
      return 0; // Evitamos división por cero
    }
  
    // Contar actividades completadas (donde `Completo` está en true)
    const actividadesCompletadas = planesTrabajo.preguntasPlanes.filter(
      (pregunta) => pregunta.Completo
    ).length;
  
    // Calculamos el porcentaje
    return Math.floor((actividadesCompletadas / totalActividades) * 100);
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
