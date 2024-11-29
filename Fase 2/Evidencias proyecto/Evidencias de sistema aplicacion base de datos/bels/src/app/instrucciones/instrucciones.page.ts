import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instrucciones',
  templateUrl: './instrucciones.page.html',
  styleUrls: ['./instrucciones.page.scss'],
})
export class InstruccionesPage {
  constructor(
    private firebaseService: FirebaseService,
    private navCtrl: NavController,
    private router: Router
  ) {}

  async onRealizarTestClick() {
    try {
      // Obtener el ID del usuario logueado
      const usuarioIdDocumento = await this.firebaseService.obtenerIdUsuarioDocumento();
      if (!usuarioIdDocumento) return;

      // Obtener el último plan de trabajo guardado para el usuario ordenado por timestamp
      const ultimoPlan = await this.firebaseService.obtenerUltimoPlanTrabajo(usuarioIdDocumento);

      if (ultimoPlan) {
        console.log(`Último plan de trabajo encontrado para el usuario ${usuarioIdDocumento}:`, ultimoPlan);

        // Verificar si el plan tiene puntuación perfecta o está completado
        const puntuacionPerfecta = this.verificarPuntuacionPerfecta(ultimoPlan['preguntasPlanes']);
        
        if (puntuacionPerfecta || ultimoPlan['planCompletado']) {
          // Determinar el grupo actual y calcular el siguiente grupo
          const grupoActual = ultimoPlan['Grupo']; // Usar el grupo desde el nivel superior del documento
          const siguienteGrupo = this.obtenerSiguienteGrupo(grupoActual);

          console.log(`Grupo actual: ${grupoActual}, Siguiente grupo: ${siguienteGrupo}`);

          // Redirigir a realizar-test con el siguiente grupo
          this.navCtrl.navigateForward(`/realizar-test`, {
            queryParams: { grupo: siguienteGrupo }
          });
        } else {
          console.warn("El puntaje no es perfecto. Revisar resultados.");
        }
      } else {
        // Si no se encontró un plan previo, redirigir al test del primer grupo "Autocuidado"
        console.warn("No se encontró un plan guardado previamente. Comenzando con el grupo 'Autocuidado'.");
        this.navCtrl.navigateForward(`/realizar-test`, {
          queryParams: { grupo: 'Autocuidado' }
        });
      }
    } catch (error) {
      console.error("Error al intentar realizar el test:", error);
    }
  }

  // Verifica si todas las respuestas en el plan de trabajo tienen puntuación perfecta (asumiendo 4 como perfecto)
  verificarPuntuacionPerfecta(preguntasPlanes: any[]): boolean {
    return preguntasPlanes.every((pregunta: any) => pregunta.puntaje === 4);
  }

  // Obtiene el siguiente grupo basado en el grupo actual
  obtenerSiguienteGrupo(grupoActual: string): string {
    const grupos = ['Autocuidado', 'Habilidades Domésticas', 'Habilidades Comunitarias', 'Relaciones Sociales'];
    const indiceActual = grupos.indexOf(grupoActual);
    return grupos[indiceActual + 1] || 'Autocuidado'; // Si es el último grupo, vuelve al primero
  }

  irAlHome() {
    this.router.navigate(['/pag-bienvenida']).then(() => {
      // Recarga la página actual
    });
  }
}
