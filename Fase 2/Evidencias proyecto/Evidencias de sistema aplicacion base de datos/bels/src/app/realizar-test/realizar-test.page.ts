import { Component, OnInit } from '@angular/core';
import { BelsService } from '../services/question.service';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-realizar-test',
  templateUrl: './realizar-test.page.html',
  styleUrls: ['./realizar-test.page.scss'],
})
export class RealizarTestPage implements OnInit {
  preguntas: any[] = [];
  indiceActual: number = 0;
  grupoActivo: string = "Autocuidado";

  constructor(private router: Router, private belsService: BelsService, private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.obtenerPreguntasPorGrupo();
  }

  obtenerPreguntasPorGrupo() {
    this.belsService.getPreguntas().subscribe(data => {
      this.preguntas = data.filter(p => p.Grupo === this.grupoActivo);
      this.indiceActual = 0;
      console.log("Preguntas para el grupo activo:", this.grupoActivo, this.preguntas);
    });
  }

  siguiente() {
    if (this.indiceActual < this.preguntas.length - 1) {
      this.indiceActual++;
    }
  }

  anterior() {
    if (this.indiceActual > 0) {
      this.indiceActual--;
    }
  }

  actualizarEstado(indice: number) {
    this.preguntas[indice].estado = true;
    this.verificarProgreso();
  }

  async enviarFormulario() {
    // Crear un array con las respuestas del usuario
    const respuestasArray = this.preguntas.map(pregunta => ({
      pregunta: pregunta.pregunta,
      valor: pregunta.valor,
      estado: pregunta.estado
    }));

    const grupo = this.grupoActivo;

    // Obtener ID de usuario desde localStorage o Firebase si no existe
    let usuarioIdDocumento = localStorage.getItem('userId');
    if (!usuarioIdDocumento) {
      console.log("ID de usuario no encontrado en localStorage. Intentando obtenerlo desde Firebase.");
      usuarioIdDocumento = await this.firebaseService.obtenerIdUsuarioDocumento();
      if (usuarioIdDocumento) {
        localStorage.setItem('userId', usuarioIdDocumento);
      } else {
        console.error("No se pudo obtener el ID de usuario.");
        return;
      }
    }

    // Guardar respuestas en Firebase
    try {
      await this.firebaseService.guardarRespuestasGrupo(usuarioIdDocumento, grupo, respuestasArray);
      console.log("Respuestas guardadas correctamente.");
      this.router.navigate(['/plan-pruebas-langchain']);
    } catch (error) {
      console.error('Error al enviar las respuestas:', error);
    }
  }

  verificarProgreso() {
    const puntajeMaximo = this.obtenerPuntajeMaximoPorGrupo(this.grupoActivo);
    const puntajeActual = this.obtenerPuntajeActualPorGrupo(this.grupoActivo);

    console.log(`Puntaje actual: ${puntajeActual}, Puntaje máximo: ${puntajeMaximo}`);

    if (puntajeActual >= puntajeMaximo) {
      console.log(`Puntaje alcanzado para el grupo: ${this.grupoActivo}. Desbloqueando el siguiente grupo.`);
      this.desbloquearSiguienteGrupo();
    }
  }

  obtenerPuntajeMaximoPorGrupo(grupo: string): number {
    switch (grupo) {
      case "Autocuidado": return 40;
      case "Habilidades Comunitarias": return 16;
      case "Habilidades Domésticas": return 28;
      case "Relaciones Sociales": return 20;
      default: return 0;
    }
  }

  obtenerPuntajeActualPorGrupo(grupo: string): number {
    return this.preguntas
      .filter(p => p.Grupo === grupo)
      .reduce((acc, curr) => acc + (parseInt(curr.valor, 10) || 0), 0);
  }

  desbloquearSiguienteGrupo() {
    if (this.grupoActivo === "Autocuidado") {
      this.grupoActivo = "Habilidades Comunitarias";
    } else if (this.grupoActivo === "Habilidades Comunitarias") {
      this.grupoActivo = "Habilidades Domésticas";
    } else if (this.grupoActivo === "Habilidades Domésticas") {
      this.grupoActivo = "Relaciones Sociales";
    }
    console.log("Nuevo grupo desbloqueado:", this.grupoActivo);
    this.obtenerPreguntasPorGrupo();
  }
}


