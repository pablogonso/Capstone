import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-plan-pruebas-langchain',
  templateUrl: './plan-pruebas-langchain.page.html',
  styleUrls: ['./plan-pruebas-langchain.page.scss'],
})
export class PlanPruebasLangchainPage implements OnInit {
  ciudad = "Santiago";
  pais = "Chile";
  recomendaciones: any[] = [];
  cargando: boolean = false;
  grupoActivo: string = "Autocuidado"; // Inicializamos con el primer grupo

  constructor(private firebaseService: FirebaseService) {}

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
        
        // Asegúrate de que 'this.recomendaciones' sea un array
        this.recomendaciones = response.data.prediccion.map((recomendacion: any) => ({
          ...recomendacion,
          puntaje_total: recomendacion.valor // Aquí se cambia para que sea el puntaje de la pregunta
        }));
      } else {
        console.error("No se encontró la predicción en la respuesta del backend.");
      }
    } catch (error) {
      console.error("Error al enviar las respuestas al modelo predictivo:", error);
    }
  
    this.cargando = false;
  }
  
  
}
