import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-instrucciones',
  templateUrl: './instrucciones.page.html',
  styleUrls: ['./instrucciones.page.scss'],
})
export class InstruccionesPage {
  constructor(
    private firebaseService: FirebaseService,
    private navCtrl: NavController
  ) {}

  async onRealizarTestClick() {
    try {
      // Obtener el ID del usuario logueado
      const usuarioIdDocumento = await this.firebaseService.obtenerIdUsuarioDocumento();
      if (!usuarioIdDocumento) return;

      // Obtener el último test guardado para el usuario ordenado por timestamp
      const ultimoTest = await this.firebaseService.obtenerUltimoTestGuardado(usuarioIdDocumento);

      if (ultimoTest) {
        console.log(`Último test encontrado para el usuario ${usuarioIdDocumento}:`, ultimoTest);

        // Verificar si la puntuación del último test es perfecta
        const puntuacionPerfecta = this.verificarPuntuacionPerfecta(ultimoTest.respuestas);
        
        if (puntuacionPerfecta) {
          // Determinar el grupo actual y calcular el siguiente grupo
          const grupoActual = ultimoTest.grupo; // Usar el grupo desde el nivel superior del documento
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
        // Si no se encontró un test previo, redirigir al test del primer grupo "Autocuidado"
        console.warn("No se encontró un test guardado previamente. Comenzando con el grupo 'Autocuidado'.");
        this.navCtrl.navigateForward(`/realizar-test`, {
          queryParams: { grupo: 'Autocuidado' }
        });
      }
    } catch (error) {
      console.error("Error al intentar realizar el test:", error);
    }
  }

  // Verifica si todas las respuestas tienen puntuación perfecta (asumiendo 4 como perfecto)
  verificarPuntuacionPerfecta(respuestas: any[]): boolean {
    return respuestas.every((respuesta: any) => respuesta.valor === 4);
  }

  // Obtiene el siguiente grupo basado en el grupo actual
  obtenerSiguienteGrupo(grupoActual: string): string {
    const grupos = ['Autocuidado', 'Habilidades Domésticas', 'Habilidades Comunitarias', 'Relaciones Sociales'];
    const indiceActual = grupos.indexOf(grupoActual);
    return grupos[indiceActual + 1] || 'Autocuidado'; // Si es el último grupo, vuelve al primero
  }
}
