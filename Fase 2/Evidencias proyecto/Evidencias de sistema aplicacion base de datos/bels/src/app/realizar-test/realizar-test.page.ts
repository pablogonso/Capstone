import { Component, OnInit } from '@angular/core';
import { BelsService } from '../services/question.service'; // Asegúrate de que la ruta es correcta
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importar AngularFirestore para trabajar con Firebase
import { Router } from '@angular/router';

@Component({
  selector: 'app-realizar-test',
  templateUrl: './realizar-test.page.html',
  styleUrls: ['./realizar-test.page.scss'],
})
export class RealizarTestPage implements OnInit {
  preguntas: any[] = [];
  indiceActual: number = 0;  // Controla la pregunta actual

  constructor(private router: Router, private belsService: BelsService, private firestore: AngularFirestore) { }

  ngOnInit() {
    // Llamar al servicio para obtener las preguntas cuando se cargue el componente
    this.belsService.getPreguntas().subscribe(data => {
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

  // Función para activar el estado cuando el usuario selecciona un valor
  actualizarEstado(indice: number) {
    this.preguntas[indice].estado = true;
  }

  // Método para procesar el envío del formulario
enviarFormulario() {
  // Crear un array con las respuestas del usuario
  const respuestasArray = this.preguntas.map(pregunta => ({
    pregunta: pregunta.pregunta,
    valor: pregunta.valor,
    estado: pregunta.estado,
    grupo: pregunta.Grupo
  }));

  // Guardar las respuestas en la colección 'Respuestas' en Firebase
  this.firestore.collection('Respuestas').add({ respuestas: respuestasArray })
    .then((docRef) => {
      console.log(`Respuestas enviadas correctamente con ID generado: ${docRef.id}`);
      
      // Guardar el ID en localStorage
      localStorage.setItem('documentoId', docRef.id);

      // Redirigir al usuario a la página del plan pruebas langchain
      this.router.navigate(['/plan-pruebas-langchain']);
    })
    .catch(error => {
      console.error('Error al enviar las respuestas: ', error);
    });
}

}

