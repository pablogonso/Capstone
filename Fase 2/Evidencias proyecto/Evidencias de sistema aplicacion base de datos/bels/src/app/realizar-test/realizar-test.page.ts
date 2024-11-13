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
  respuestasId: string = ''; // Declara respuestasId aquí
  guardando: boolean = false; // Nueva variable de control
  botonRealizarTestHabilitado: boolean = false; // Nueva variable de control

  constructor(private router: Router, private belsService: BelsService, private firebaseService: FirebaseService) {}

  async ngOnInit() {
    localStorage.removeItem('userId'); 
    const usuarioIdDocumento = await this.obtenerIdUsuarioActual();

    if (usuarioIdDocumento) {
      const ultimoPlan = await this.firebaseService.obtenerUltimoPlanTrabajo(usuarioIdDocumento);
      
      if (ultimoPlan) {
        console.log(`Último plan de trabajo encontrado para el usuario ${usuarioIdDocumento}: ${ultimoPlan.id || 'sin ID'}`);
        
        // Control de acceso en base a planCompletado
        this.botonRealizarTestHabilitado = ultimoPlan.planCompletado === true;
        if (!this.botonRealizarTestHabilitado) {
          console.log("El plan de trabajo anterior no está completado. Acceso al test bloqueado.");
          return;
        }
      } else {
        console.log("No se encontró un plan de trabajo previo, comenzando con el primer grupo.");
        this.botonRealizarTestHabilitado = true;
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
    this.verificarProgreso(); // Verifica el progreso solo si todas las preguntas han sido respondidas
  }

  async enviarFormulario() {
    if (this.guardando) return; // Si ya está en proceso de guardado, no hacer nada
    this.guardando = true; // Activar el estado de guardado

    const respuestasArray = this.preguntas.map(pregunta => ({
      pregunta: pregunta.pregunta,
      valor: pregunta.valor,
      estado: pregunta.estado
    }));

    const grupo = this.grupoActivo;
    const usuarioIdDocumento = await this.obtenerIdUsuarioActual();

    if (!usuarioIdDocumento) {
      console.error("No se pudo obtener el ID de usuario actual para guardar las respuestas.");
      this.guardando = false; // Desactivar el estado de guardado en caso de error
      return;
    }

    try {
      // Genera el ID personalizado autoincrementable
      const idPersonalizado = await this.firebaseService.generarIdRespuesta(usuarioIdDocumento);
      console.log(`ID personalizado generado: ${idPersonalizado}`);
      
      // Guarda las respuestas en Firebase usando el ID personalizado
      await this.firebaseService.guardarRespuestasGrupoConId(usuarioIdDocumento, grupo, respuestasArray, idPersonalizado);
      console.log(`Respuestas guardadas en Firebase con ID: ${idPersonalizado}`);

      // Guarda el ID en respuestasId y en localStorage para usarlo en plan-pruebas-langchain
      this.respuestasId = idPersonalizado;
      localStorage.setItem('respuestasId', this.respuestasId);
    } catch (error) {
      console.error('Error al enviar las respuestas:', error);
    } finally {
      this.guardando = false; // Desactivar el estado de guardado después de completar
    }
  }

  async verificarProgreso() {
    // Verifica que todas las preguntas estén respondidas antes de evaluar el puntaje
    const todasRespondidas = this.preguntas.every(pregunta => pregunta.estado === true);
    if (!todasRespondidas) return;

    const puntajeMaximo = this.obtenerPuntajeMaximoPorGrupo(this.grupoActivo);
    const puntajeActual = this.calcularPuntajeTotal(this.preguntas);

    console.log(`Puntaje actual: ${puntajeActual}, Puntaje máximo: ${puntajeMaximo}`);

    if (puntajeActual >= puntajeMaximo) {
      console.log(`Puntaje máximo alcanzado para el grupo: ${this.grupoActivo}. Desbloqueando el siguiente grupo.`);
      await this.guardarYAvanzarGrupo(); // Desbloquear el siguiente grupo y cargar sus preguntas
    } else {
      console.log(`Puntaje insuficiente en el grupo: ${this.grupoActivo}. Redirigiendo a Generar plan de trabajo.`);
      await this.enviarFormulario(); // Guarda las respuestas
      this.router.navigate(['/plan-pruebas-langchain']); // Redirige a la generación del plan de trabajo
    }
  }

  calcularPuntajeTotal(preguntas: any[]): number {
    return preguntas.reduce((acc: number, pregunta: any) => acc + (parseInt(pregunta.valor, 10) || 0), 0);
  }

  async guardarYAvanzarGrupo() {
    await this.enviarFormulario();
    this.desbloquearSiguienteGrupo(); // Desbloquea y carga el siguiente grupo
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
    this.avanzarAlSiguienteGrupo(this.grupoActivo); // Avanza al siguiente grupo
    this.obtenerPreguntasPorGrupo(); // Carga preguntas del nuevo grupo
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
