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
  recomendaciones: any = {};  // Cambiado de any[] a any
  cargando: boolean = false;
  grupoActivo: string = "Autocuidado"; // Inicializamos con el primer grupo

  constructor(private firebaseService: FirebaseService, private planService: PlanService) {}


  ngOnInit() {}

  // Método para generar respuestas utilizando el ID del documento almacenado en localStorage
  async generarRespuestas() {
    this.cargando = true;

    try {
      // Obtener el ID del documento de localStorage
      const documentoId = localStorage.getItem('documentoId');
      if (!documentoId) {
        console.error('No se encontró el ID del documento en localStorage');
        this.cargando = false;
        return;
      }

      console.log("Enviando la ID del documento al backend:", documentoId);

      // Solicitar datos al backend
      const response = await axios.post('http://127.0.0.1:5000/api/generar-respuestas', {
        documentoId: documentoId,
        ciudad: this.ciudad,
        pais: this.pais,
        grupoActivo: this.grupoActivo // Enviar el grupo activo
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.respuestas) {
        const respuestasFirebase = response.data.respuestas;
        console.log("Respuestas obtenidas desde Firebase:", respuestasFirebase);

        // Verificación adicional de la estructura de los datos
        if (!Array.isArray(respuestasFirebase) || respuestasFirebase.length === 0) {
          console.error("Las respuestas de Firebase no son un array o están vacías.");
          this.cargando = false;
          return;
        }

        // Enviar las respuestas al modelo predictivo
        await this.enviarAlModeloPredictivo(respuestasFirebase);
      } else {
        console.error("No se encontraron respuestas en la respuesta del backend.");
      }
    } catch (error) {
      console.error("Error al generar las respuestas:", error);
    }

    this.cargando = false;
  }

  // Método para enviar las respuestas al modelo predictivo
  async enviarAlModeloPredictivo(respuestasGrupoActivo: any[]) {
    try {
      console.log("Enviando respuestas al modelo predictivo:", respuestasGrupoActivo);
  
      if (!respuestasGrupoActivo || respuestasGrupoActivo.length === 0) {
        console.error("Las respuestas están vacías o no son válidas.");
        this.cargando = false;
        return;
      }
  
      // Realizar la solicitud POST al backend
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
  
        // Mapear las recomendaciones para incluir pregunta, plan y puntaje
        const preguntasPlanes = response.data.prediccion.map((recomendacion: any) => ({
          pregunta: recomendacion.pregunta,
          plan: recomendacion.recomendacion,
          puntaje: recomendacion.valor  // Agregar el puntaje de la pregunta
        }));
  
        // Obtener el ID del usuario desde localStorage
        const documentoId = localStorage.getItem('documentoId');
        if (!documentoId) {
          console.error('No se encontró el ID del documento en localStorage');
          this.cargando = false;
          return;
        }
  
        // Asignar el idGrupo como string según el grupoActivo
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
            return;
        }
  
        // Generar el idPlan único
        const idPlan = this.planService.generarIdPlan(documentoId, 1);  // Solo una vez por grupo
  
        // Crear un único objeto para almacenar en Firebase
        const planTrabajo = {
          idPlan,
          idGrupo,
          preguntasPlanes  // Array con las preguntas, planes y puntajes
        };
  
        // Asignar el plan de trabajo a `this.recomendaciones` para que esté accesible en el HTML
        this.recomendaciones = planTrabajo;
  
        // Guardar el objeto completo en Firebase
        await this.planService.guardarPlanTrabajoGrupo(planTrabajo);
  
      } else {
        console.error("No se encontró la predicción en la respuesta del backend.");
      }
    } catch (error) {
      console.error("Error al enviar las respuestas al modelo predictivo:", error);
    }
  
    this.cargando = false;
  }
  
  
}
