import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { FirebaseService } from '../services/firebase.service';
import { PlanService } from '../services/plan.service';

@Component({
  selector: 'app-plan-pruebas-langchain',
  templateUrl: './plan-pruebas-langchain.page.html',
  styleUrls: ['./plan-pruebas-langchain.page.scss'],
})
export class PlanPruebasLangchainPage implements OnInit {
  ciudad = "Santiago";
  pais = "Chile";
  recomendaciones: any = {};
  cargando: boolean = false;
  grupoActivo: string = "Autocuidado";
  buttonDisabled: boolean = false;
  respuestasId: string = '';

  constructor(private firebaseService: FirebaseService, private planService: PlanService) {}

  async ngOnInit() {
    this.respuestasId = localStorage.getItem('respuestasId') || '';
    if (!this.respuestasId) {
      console.error("No se encontró el ID de respuestas en localStorage.");
      return;
    }
  }

  async generarRespuestas() {
    this.cargando = true;
    this.buttonDisabled = true;
    console.log(`Iniciando generación de respuestas para el grupo activo: ${this.grupoActivo}`);

    try {
      const respuestasFirebase = await this.firebaseService.obtenerRespuestasPorId(this.respuestasId);
      if (!respuestasFirebase || respuestasFirebase.length === 0) {
        console.error(`Las respuestas para el grupo ${this.grupoActivo} no son un array o están vacías.`);
        this.cargando = false;
        this.buttonDisabled = false;
        return;
      }

      const esPuntuacionPerfecta = respuestasFirebase.every((respuesta: any) => respuesta.puntaje === 4);
      if (esPuntuacionPerfecta) {
        console.log(`El grupo ${this.grupoActivo} tiene puntuación perfecta. Avanzando al siguiente grupo.`);
        this.avanzarAlSiguienteGrupo();

        if (this.grupoActivo === "No hay más grupos") {
          console.log("Todos los grupos han alcanzado puntuación perfecta o no hay más grupos para procesar.");
          this.cargando = false;
          this.buttonDisabled = false;
          return;
        }

        await this.generarRespuestas();
        return;
      }

      console.log("Respuestas obtenidas desde Firebase para el grupo con puntaje bajo:", respuestasFirebase);
      await this.enviarAlModeloPredictivo(respuestasFirebase);

    } catch (error) {
      console.error("Error al generar las respuestas:", error);
      this.buttonDisabled = false;
    }

    this.cargando = false;
  }

  avanzarAlSiguienteGrupo() {
    const grupos = ["Autocuidado", "Habilidades Domésticas", "Habilidades Comunitarias", "Relaciones Sociales"];
    const indexActual = grupos.indexOf(this.grupoActivo);
    this.grupoActivo = indexActual < grupos.length - 1 ? grupos[indexActual + 1] : "No hay más grupos";
    console.log(`Grupo avanzado a: ${this.grupoActivo}`);
  }

  async enviarAlModeloPredictivo(respuestasGrupoActivo: any[]) {
    try {
      console.log("Enviando respuestas al modelo predictivo:", respuestasGrupoActivo);

      const response = await axios.post('http://127.0.0.1:5000/api/predict', {
        respuestas: respuestasGrupoActivo,
        ciudad: this.ciudad,
        pais: this.pais
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.prediccion) {
        console.log("Resultado del modelo predictivo:", response.data.prediccion);

        const preguntasPlanes = response.data.prediccion.map((recomendacion: any) => ({
          pregunta: recomendacion.pregunta,
          plan: recomendacion.recomendacion,
          puntaje: recomendacion.valor,
          horaRecomendacion: this.extraerHoraDeRecomendacion(recomendacion.recomendacion) // Extraer hora de la recomendación
        }));

        const usuarioIdDocumento = await this.firebaseService.obtenerIdUsuarioDocumento();
        if (!usuarioIdDocumento) {
          console.error('No se encontró el ID de documento de usuario');
          this.cargando = false;
          this.buttonDisabled = false;
          return;
        }

        let idGrupo = '';
        switch (this.grupoActivo) {
          case "Autocuidado": idGrupo = '1'; break;
          case "Habilidades Domésticas": idGrupo = '2'; break;
          case "Habilidades Comunitarias": idGrupo = '3'; break;
          case "Relaciones Sociales": idGrupo = '4'; break;
          default:
            console.error("Grupo activo desconocido:", this.grupoActivo);
            this.cargando = false;
            this.buttonDisabled = false;
            return;
        }

        const idPlan = await this.planService.generarIdPlan(usuarioIdDocumento);
        const esPuntuacionPerfecta = preguntasPlanes.every((p: any) => p.puntaje === 4);

        const planTrabajo = {
          idPlan,
          idGrupo,
          preguntasPlanes: esPuntuacionPerfecta ? [] : preguntasPlanes,
          indicadorPlan: esPuntuacionPerfecta
            ? "No se generó plan de trabajo debido a que tuvo puntuación perfecta"
            : "Recomendaciones generadas por la IA",
          planCompletado: false,
          Grupo: this.grupoActivo,
          idUsuario: usuarioIdDocumento,
          timestamp: new Date()
        };

        await this.planService.guardarPlanTrabajoGrupo(planTrabajo);
        console.log(`Plan de trabajo guardado con ID: ${idPlan}`, planTrabajo); // Log del ID de plan de trabajo

        this.recomendaciones = planTrabajo;

      } else {
        console.error("No se encontró la predicción en la respuesta del backend.");
        this.buttonDisabled = false;
      }
    } catch (error) {
      console.error("Error al enviar las respuestas al modelo predictivo:", error);
      this.buttonDisabled = false;
    }

    this.cargando = false;
  }

  // Método para extraer la hora en formato hh:mm:ss de una recomendación
  private extraerHoraDeRecomendacion(recomendacion: string): string | null {
    const horaRegex = /\b\d{2}:\d{2}:\d{2}\b/;
    const match = recomendacion.match(horaRegex);
    return match ? match[0] : null;
  }
}
