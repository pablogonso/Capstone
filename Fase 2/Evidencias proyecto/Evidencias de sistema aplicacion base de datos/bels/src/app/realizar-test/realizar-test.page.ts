import { Component, OnInit } from '@angular/core';
import { BelsService } from '../services/question.service'; // Asegúrate de que la ruta es correcta

@Component({
  selector: 'app-realizar-test',
  templateUrl: './realizar-test.page.html',
  styleUrls: ['./realizar-test.page.scss'],
})
export class RealizarTestPage implements OnInit {
  preguntas: any[] = [];
  indiceActual: number = 0;  // Controla la pregunta actual

  constructor(private belsService: BelsService) { }

  ngOnInit() {
    // Llamar al servicio para obtener las preguntas cuando se cargue el componente
    this.belsService.getPreguntas().subscribe(data => {
      console.log('Preguntas obtenidas:', data); // Verificar si los datos llegan
      this.preguntas = data;
    });
  }

  // Función para pasar a la siguiente pregunta
  siguiente() {
    if (this.indiceActual < this.preguntas.length - 1) {
      this.indiceActual++;
    }
  }

  // Función para regresar a la pregunta anterior
  anterior() {
    if (this.indiceActual > 0) {
      this.indiceActual--;
    }
  }

  // Función para procesar el envío del formulario
  enviarFormulario() {
    console.log('Respuestas enviadas:', this.preguntas);

    // Aquí puedes agregar lógica para almacenar las respuestas y los valores en Firebase
    // Por ejemplo, podrías actualizar el campo `valor` en cada pregunta en Firestore
  }
}
