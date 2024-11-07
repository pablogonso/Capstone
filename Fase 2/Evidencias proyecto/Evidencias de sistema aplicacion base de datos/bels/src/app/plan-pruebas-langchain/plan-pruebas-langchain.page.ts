// plan-pruebas-langchain.page.ts

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
  recomendaciones: any = {}; // Cambiado de any[] a any
  cargando: boolean = false;
  grupoActivo: string = "Autocuidado"; // Inicializamos con el primer grupo
  buttonDisabled: boolean = false; // Nueva propiedad para controlar el botón

  constructor(private firebaseService: FirebaseService, private planService: PlanService) {}

  ngOnInit() {}

  async generarRespuestas() {
    this.cargando = true;
    this.buttonDisabled = true; // Deshabilitar el botón al iniciar la generación del plan
    
    console.log(`Iniciando generación de respuestas para el grupo activo: ${this.grupoActivo}`);
    
    try {
      const documentoId = localStorage.getItem('documentoId');
      if (!documentoId) {
        console.error('No se encontró el ID del documento en localStorage');
        this.cargando = false;
        this.buttonDisabled = false;
        return;
      }
  
      // Obtener respuestas filtradas por el grupo activo desde Firebase
      const respuestasFirebase = await this.firebaseService.getRespuestasPorGrupo(this.grupoActivo);
  
      if (!respuestasFirebase || !Array.isArray(respuestasFirebase) || respuestasFirebase.length === 0) {
        console.error(`Las respuestas para el grupo ${this.grupoActivo} no son un array o están vacías.`);
        this.cargando = false;
        this.buttonDisabled = false;
        return;
      }
  
      // Verificar si el grupo activo tiene puntuación perfecta
      const esPuntuacionPerfecta = respuestasFirebase.every((respuesta: any) => respuesta.puntaje === 4);
      if (esPuntuacionPerfecta) {
        console.log(`El grupo ${this.grupoActivo} tiene puntuación perfecta. Avanzando al siguiente grupo.`);
        
        // Avanzar al siguiente grupo sin generar un plan de trabajo para el grupo actual
        this.avanzarAlSiguienteGrupo();
  
        if (this.grupoActivo === "No hay más grupos") {
          console.log("Todos los grupos han alcanzado puntuación perfecta o no hay más grupos para procesar.");
          this.cargando = false;
          this.buttonDisabled = false;
          return;
        }
  
        // Llamada recursiva para intentar generar respuestas en el siguiente grupo
        await this.generarRespuestas();
        return;
      }
  
      console.log("Respuestas obtenidas desde Firebase para el grupo con puntaje bajo:", respuestasFirebase);
  
      // Llama al método para enviar las respuestas al modelo predictivo
      await this.enviarAlModeloPredictivo(respuestasFirebase);
  
    } catch (error) {
      console.error("Error al generar las respuestas:", error);
      this.buttonDisabled = false;
    }
  
    this.cargando = false; // Ocultar el spinner al final
  }
  
  // Método para avanzar al siguiente grupo
  avanzarAlSiguienteGrupo() {
    switch (this.grupoActivo) {
      case "Autocuidado":
        this.grupoActivo = "Habilidades Comunitarias";
        break;
      case "Habilidades Comunitarias":
        this.grupoActivo = "Relaciones Sociales";
        break;
      case "Relaciones Sociales":
        this.grupoActivo = "No hay más grupos";
        break;
      default:
        console.log("No hay más grupos para avanzar.");
        this.grupoActivo = "No hay más grupos";
    }
    console.log(`Grupo avanzado a: ${this.grupoActivo}`);
  }
  
  
  

// Método para enviar las respuestas al modelo predictivo
async enviarAlModeloPredictivo(respuestasGrupoActivo: any[]) {
  try {
    console.log("Enviando respuestas al modelo predictivo:", respuestasGrupoActivo);

    if (!respuestasGrupoActivo || respuestasGrupoActivo.length === 0) {
      console.error("Las respuestas están vacías o no son válidas.");
      this.cargando = false;
      this.buttonDisabled = false; // Habilitar el botón si no hay respuestas válidas
      return;
    }

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
        puntaje: recomendacion.valor
      }));

      // Obtener el ID de documento del usuario
      const usuarioIdDocumento = await this.firebaseService.obtenerIdUsuarioDocumento();
      if (!usuarioIdDocumento) {
        console.error('No se encontró el ID de documento de usuario');
        this.cargando = false;
        this.buttonDisabled = false; // Habilitar el botón si no se encuentra el ID de usuario
        return;
      }

      let idGrupo = '';
      switch (this.grupoActivo) {
        case "Autocuidado":
          idGrupo = '1';
          break;
        case "Habilidades Domésticas":
          idGrupo = '2';
          break;
        case "Habilidades Comunitarias":
          idGrupo = '3';
          break;
        case "Relaciones Sociales":
          idGrupo = '4';
          break;
        default:
          console.error("Grupo activo desconocido:", this.grupoActivo);
          this.cargando = false;
          this.buttonDisabled = false; // Habilitar el botón si el grupo es desconocido
          return;
      }

      // Generar `idPlan` único
      const idPlan = await this.planService.generarIdPlan(usuarioIdDocumento);

      // Verificar si el grupo tiene puntuación perfecta
      const esPuntuacionPerfecta = preguntasPlanes.every((p: any) => p.puntaje === 4);

      const planTrabajo = {
        idPlan,
        idGrupo,
        preguntasPlanes: esPuntuacionPerfecta
          ? [] // No hay recomendaciones si el puntaje es perfecto
          : preguntasPlanes,
        indicadorPlan: esPuntuacionPerfecta
          ? "No se generó plan de trabajo debido a que tuvo puntuación perfecta"
          : "Recomendaciones generadas por la IA",
        planCompletado: false, // Estado inicial del plan
        Grupo: this.grupoActivo // Nombre del grupo al que pertenece el plan
      };

      this.recomendaciones = planTrabajo;

      // Guardar el plan de trabajo en Firebase
      await this.planService.guardarPlanTrabajoGrupo(planTrabajo);

    } else {
      console.error("No se encontró la predicción en la respuesta del backend.");
      this.buttonDisabled = false; // Habilitar el botón si no se encuentra la predicción
    }
  } catch (error) {
    console.error("Error al enviar las respuestas al modelo predictivo:", error);
    this.buttonDisabled = false; // Habilitar el botón en caso de error
  }

  this.cargando = false; // Ocultar el spinner al final
}

}
