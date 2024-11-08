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

  constructor(private router: Router, private belsService: BelsService, private firebaseService: FirebaseService) {}

  async ngOnInit() {
    localStorage.removeItem('userId'); 
    const usuarioIdDocumento = await this.obtenerIdUsuarioActual();

    if (usuarioIdDocumento) {
      const ultimoTest = await this.firebaseService.obtenerUltimoTestGuardado(usuarioIdDocumento);
      if (ultimoTest) {
        console.log(`ID del último test encontrado para el usuario ${usuarioIdDocumento}: ${ultimoTest.id}`);
        const puntajeTotal = this.obtenerPuntajeMaximoPorGrupo(ultimoTest.grupo);
        const puntajeObtenido = this.calcularPuntajeTotal(ultimoTest.respuestas);

        if (puntajeObtenido >= puntajeTotal) {
          console.log(`Puntuación completa en ${ultimoTest.grupo}. Cargando el siguiente grupo.`);
          this.avanzarAlSiguienteGrupo(ultimoTest.grupo);
        } else {
          console.log(`Cargando preguntas del grupo ${ultimoTest.grupo} ya que no se alcanzó el puntaje máximo.`);
          this.grupoActivo = ultimoTest.grupo;
        }
      } else {
        console.log("No se encontró un test previo, comenzando con el primer grupo.");
        this.obtenerPreguntasPorGrupo();
      }
    } else {
      console.error("No se pudo obtener el ID del usuario actual.");
      return;
    }

    this.obtenerPreguntasPorGrupo();
  }

  async obtenerIdUsuarioActual(): Promise<string | null> {
    let usuarioIdDocumento = await this.firebaseService.obtenerIdUsuarioDocumento();
    if (usuarioIdDocumento) {
      localStorage.setItem('userId', usuarioIdDocumento);
      return usuarioIdDocumento;
    } else {
      console.error("No se pudo obtener el ID del usuario desde Firebase.");
      return null;
    }
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
    const respuestasArray = this.preguntas.map(pregunta => ({
      pregunta: pregunta.pregunta,
      valor: pregunta.valor,
      estado: pregunta.estado
    }));

    const grupo = this.grupoActivo;
    const usuarioIdDocumento = await this.obtenerIdUsuarioActual();

    if (!usuarioIdDocumento) {
      console.error("No se pudo obtener el ID de usuario actual para guardar las respuestas.");
      return;
    }

    try {
      await this.firebaseService.guardarRespuestasGrupo(usuarioIdDocumento, grupo, respuestasArray);
      console.log("Respuestas guardadas correctamente.");
      
      // Redirige a plan-pruebas-langchain después de guardar las respuestas exitosamente
      this.router.navigate(['/plan-pruebas-langchain']);
    } catch (error) {
      console.error('Error al enviar las respuestas:', error);
    }
  }

  async verificarProgreso() {
    const puntajeMaximo = this.obtenerPuntajeMaximoPorGrupo(this.grupoActivo);
    const puntajeActual = this.calcularPuntajeTotal(this.preguntas);

    console.log(`Puntaje actual: ${puntajeActual}, Puntaje máximo: ${puntajeMaximo}`);

    if (puntajeActual >= puntajeMaximo) {
      console.log(`Puntaje alcanzado para el grupo: ${this.grupoActivo}. Guardando puntaje y avanzando al siguiente grupo.`);
      await this.guardarYAvanzarGrupo();
    }
  }

  calcularPuntajeTotal(preguntas: any[]): number {
    return preguntas.reduce((acc: number, pregunta: any) => acc + (parseInt(pregunta.valor, 10) || 0), 0);
  }

  async guardarYAvanzarGrupo() {
    await this.enviarFormulario();
    this.desbloquearSiguienteGrupo();
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

  desbloquearSiguienteGrupo() {
    this.avanzarAlSiguienteGrupo(this.grupoActivo);
    this.obtenerPreguntasPorGrupo();
  }

  avanzarAlSiguienteGrupo(grupoActual: string) {
    if (grupoActual === "Autocuidado") {
      this.grupoActivo = "Habilidades Domésticas";
    } else if (grupoActual === "Habilidades Domésticas") {
      this.grupoActivo = "Habilidades Comunitarias";
    } else if (grupoActual === "Habilidades Comunitarias") {
      this.grupoActivo = "Relaciones Sociales";
    } else {
      console.log("No hay más grupos para avanzar.");
    }
    console.log(`Nuevo grupo desbloqueado: ${this.grupoActivo}`);
  }
}
