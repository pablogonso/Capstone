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

  // Método para generar respuestas utilizando el ID del documento almacenado en localStorage
  async generarRespuestas() {
    this.cargando = true;
    this.buttonDisabled = true; // Deshabilitar el botón al iniciar la generación del plan

    try {
      const documentoId = localStorage.getItem('documentoId');
      if (!documentoId) {
        console.error('No se encontró el ID del documento en localStorage');
        this.cargando = false;
        this.buttonDisabled = false; // Habilitar el botón si hay un error
        return;
      }

      console.log("Enviando la ID del documento al backend:", documentoId);

      // Solicitar datos al backend
      const response = await axios.post('http://127.0.0.1:5000/api/generar-respuestas', {
        documentoId: documentoId,
        ciudad: this.ciudad,
        pais: this.pais,
        grupoActivo: this.grupoActivo
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.respuestas) {
        const respuestasFirebase = response.data.respuestas;
        console.log("Respuestas obtenidas desde Firebase:", respuestasFirebase);

        if (!Array.isArray(respuestasFirebase) || respuestasFirebase.length === 0) {
          console.error("Las respuestas de Firebase no son un array o están vacías.");
          this.cargando = false;
          this.buttonDisabled = false; // Habilitar el botón si no hay respuestas
          return;
        }

        // Llama al método para enviar las respuestas al modelo predictivo
        await this.enviarAlModeloPredictivo(respuestasFirebase);
      } else {
        console.error("No se encontraron respuestas en la respuesta del backend.");
        this.buttonDisabled = false; // Habilitar el botón si no hay respuestas
      }
    } catch (error) {
      console.error("Error al generar las respuestas:", error);
      this.buttonDisabled = false; // Habilitar el botón en caso de error
    }

    this.cargando = false; // Ocultar el spinner
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

        const planTrabajo = {
          idPlan,
          idGrupo,
          preguntasPlanes
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
