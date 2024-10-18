// src/app/plan-pruebas-langchain/plan-pruebas-langchain.page.ts

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

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {}

  // Agrupar puntajes por grupo y enviarlos al modelo predictivo
 // src/app/plan-pruebas-langchain/plan-pruebas-langchain.page.ts

 async generarRespuestas(documentoId: string) {
  this.cargando = true;

  try {
      console.log("Enviando la ID del documento al backend:", documentoId);

      // Solicitar datos al backend
      const response = await axios.post('http://127.0.0.1:5000/api/generar-respuestas', {
          documentoId: documentoId,
          ciudad: this.ciudad,
          pais: this.pais
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
              return;
          }

          // Agrupar los puntajes por grupo y convertirlos a números enteros
          const puntajesPorGrupo: { [key: string]: number[] } = {};

          respuestasFirebase.forEach((respuesta: any) => {
              const grupo = respuesta.grupo;
              const valor = parseInt(respuesta.valor, 10); // Convertir a entero

              // Verificación adicional para asegurar que el valor sea un número válido
              if (isNaN(valor)) {
                  console.warn(`El valor no es un número válido: ${respuesta.valor}`);
                  return; // Saltar esta iteración si el valor no es un número válido
              }

              // Inicializar el grupo si no existe en el diccionario
              if (!puntajesPorGrupo[grupo]) {
                  puntajesPorGrupo[grupo] = [];
              }

              // Agregar el valor convertido a entero al grupo correspondiente
              puntajesPorGrupo[grupo].push(valor);
          });

          console.log("Puntajes agrupados por grupo:", puntajesPorGrupo);

          // Enviar los puntajes agrupados al modelo predictivo
          await this.enviarAlModeloPredictivo(puntajesPorGrupo);
      } else {
          console.error("No se encontraron respuestas en la respuesta del backend.");
      }
  } catch (error) {
      console.error("Error al generar las respuestas:", error);
  }

  this.cargando = false;
}


  // Método para enviar los puntajes al modelo predictivo

async enviarAlModeloPredictivo(puntajesPorGrupo: { [key: string]: number[] }) {
  try {
      console.log("Enviando puntajes al modelo predictivo:", puntajesPorGrupo);

      const response = await axios.post('http://127.0.0.1:5000/api/predict', {
          puntajes: puntajesPorGrupo,
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
          this.recomendaciones = Array.isArray(response.data.prediccion) ? response.data.prediccion : [response.data.prediccion];
      }
  } catch (error) {
      console.error("Error al enviar los puntajes al modelo predictivo:", error);
  }
}

}
