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
  grupoActivo: string = "Autocuidado"; // Inicializamos con el primer grupo

  constructor(private router: Router, private belsService: BelsService, private firestore: AngularFirestore) { }

  ngOnInit() {
    // Llamar al servicio para obtener las preguntas del grupo activo cuando se cargue el componente
    this.obtenerPreguntasPorGrupo();
  }

  // Método para obtener las preguntas del grupo activo
  obtenerPreguntasPorGrupo() {
    this.belsService.getPreguntas().subscribe(data => {
      // Filtrar las preguntas solo del grupo activo
      this.preguntas = data.filter(p => p.Grupo === this.grupoActivo);
      this.indiceActual = 0; // Reiniciar al primer índice
      console.log("Preguntas para el grupo activo:", this.grupoActivo, this.preguntas);
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
    // Verificar si se ha alcanzado el puntaje máximo para el grupo actual
    this.verificarProgreso();
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

  // Método para verificar si se ha completado el grupo activo
  verificarProgreso() {
    const puntajeMaximo = this.obtenerPuntajeMaximoPorGrupo(this.grupoActivo);
    const puntajeActual = this.obtenerPuntajeActualPorGrupo(this.grupoActivo);

    console.log(`Puntaje actual: ${puntajeActual}, Puntaje máximo: ${puntajeMaximo}`);

    if (puntajeActual >= puntajeMaximo) {
      console.log(`Puntaje alcanzado para el grupo: ${this.grupoActivo}. Desbloqueando el siguiente grupo.`);
      this.desbloquearSiguienteGrupo();
    }
  }

  // Método para obtener el puntaje máximo por grupo
  obtenerPuntajeMaximoPorGrupo(grupo: string): number {
    switch (grupo) {
      case "Autocuidado": return 40;
      case "Habilidades Comunitarias": return 16;
      case "Habilidades Domésticas": return 28;
      case "Relaciones Sociales": return 20;
      default: return 0;
    }
  }

  // Método para calcular el puntaje actual por grupo
  obtenerPuntajeActualPorGrupo(grupo: string): number {
    // Asegurar que solo se están contando las preguntas del grupo actual y que los valores son números válidos
    return this.preguntas
      .filter(p => p.Grupo === grupo)
      .reduce((acc, curr) => acc + (parseInt(curr.valor, 10) || 0), 0); // Convertir a número entero de forma segura
  }

  // Método para desbloquear el siguiente grupo en orden
  desbloquearSiguienteGrupo() {
    if (this.grupoActivo === "Autocuidado") {
      this.grupoActivo = "Habilidades Comunitarias";
    } else if (this.grupoActivo === "Habilidades Comunitarias") {
      this.grupoActivo = "Habilidades Domésticas";
    } else if (this.grupoActivo === "Habilidades Domésticas") {
      this.grupoActivo = "Relaciones Sociales";
    }

    // Recargar las preguntas para el nuevo grupo activo
    console.log("Nuevo grupo desbloqueado:", this.grupoActivo);
    this.obtenerPreguntasPorGrupo();
  }
}
