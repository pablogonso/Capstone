import { Component, OnInit } from '@angular/core';
import { BelsService } from '../services/question.service';
import { FirebaseService } from '../services/firebase.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-realizar-test',
  templateUrl: './realizar-test.page.html',
  styleUrls: ['./realizar-test.page.scss'],
})
export class RealizarTestPage implements OnInit {
  preguntas: any[] = [];
  indiceActual: number = 0;
  grupoActivo: string = ''; // Se establecerá desde la primera pregunta
  respuestasId: string = '';
  guardando: boolean = false;
  planCompletado: boolean = false; // Nuevo flag para verificar si el plan está completado

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private belsService: BelsService,
    private firebaseService: FirebaseService
  ) {}

  async ngOnInit() {
    // Obtener el grupo desde los queryParams
    this.route.queryParams.subscribe(params => {
      this.grupoActivo = params['grupo']; // Sin valor predeterminado
      if (!this.grupoActivo) {
        console.error("Grupo no encontrado en queryParams");
      }
      this.obtenerPreguntasPorGrupo();
    });
    
    // Obtener el ID del usuario actual
    const usuarioIdDocumento = await this.obtenerIdUsuarioActual();
    if (!usuarioIdDocumento) {
      console.error("No se pudo obtener el ID del usuario actual.");
      return;
    }

    // Verificar el último plan de trabajo del usuario al cargar la página
    const ultimoPlan = await this.firebaseService.obtenerUltimoPlanTrabajo(usuarioIdDocumento);

    if (!ultimoPlan) {
      console.warn("No se encontró ningún plan de trabajo para el usuario. Comenzando con el grupo inicial.");
    } else {
      this.planCompletado = ultimoPlan.planCompletado;
      console.log(`Plan completado: ${this.planCompletado}`);
    }
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
      // Filtrar las preguntas y asegurar que todas pertenecen al mismo grupo
      this.preguntas = data.filter(p => p.Grupo === this.grupoActivo);
      if (this.preguntas.length > 0) {
        // Asignar el grupo activo solo con el Grupo de la primera pregunta
        this.grupoActivo = this.preguntas[0].Grupo;
      }
      console.log("Grupo asignado a grupoActivo:", this.grupoActivo); // Verificar el valor aquí
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
    if (this.guardando) return;
    this.guardando = true;
  
    const respuestasArray = this.preguntas.map(pregunta => ({
      pregunta: pregunta.pregunta,
      valor: pregunta.valor,
      estado: pregunta.estado
    }));
  
    console.log("Grupo actual antes de guardar en Firebase:", this.grupoActivo); // Confirmar valor aquí
  
    const usuarioIdDocumento = await this.obtenerIdUsuarioActual();
    if (!usuarioIdDocumento) {
      console.error("No se pudo obtener el ID del usuario actual para guardar las respuestas.");
      this.guardando = false;
      return;
    }
  
    try {
      const idPersonalizado = await this.firebaseService.generarIdRespuesta(usuarioIdDocumento);
      console.log(`ID personalizado generado: ${idPersonalizado}`);
      
      // Ahora pasamos el grupo obtenido directamente de las preguntas
      await this.firebaseService.guardarRespuestasGrupoConId(usuarioIdDocumento, this.grupoActivo, respuestasArray, idPersonalizado);
      console.log(`Respuestas guardadas en Firebase con ID: ${idPersonalizado}`);
  
      this.respuestasId = idPersonalizado;
      localStorage.setItem('respuestasId', this.respuestasId);
    } catch (error) {
      console.error('Error al enviar las respuestas:', error);
    } finally {
      this.guardando = false;
    }
  }

  async verificarProgreso() {
    // Verifica si todas las preguntas han sido respondidas
    const todasRespondidas = this.preguntas.every(pregunta => pregunta.estado === true);
    if (!todasRespondidas) {
        console.log("Aún hay preguntas sin responder en el grupo actual.");
        return;
    }

    // Verificación de puntuación perfecta (asumiendo que 4 es el puntaje máximo)
    const puntajePerfecto = this.preguntas.every(pregunta => pregunta.valor === 4);
    
    if (puntajePerfecto) {
        console.log(`El test para el grupo ${this.grupoActivo} tiene puntuación perfecta. Avanzando al siguiente grupo sin generar plan de trabajo.`);
        this.desbloquearSiguienteGrupo();
        return;
    }

    // Usar el flag planCompletado para evitar múltiples verificaciones
    if (this.planCompletado) {
        console.log(`El plan de trabajo para el grupo ${this.grupoActivo} está completo. Desbloqueando el siguiente grupo.`);
        this.desbloquearSiguienteGrupo();
    } else {
        console.log(`El plan de trabajo para el grupo ${this.grupoActivo} no está completo. Redirigiendo a Generar plan de trabajo.`);
        await this.enviarFormulario();
        this.router.navigate(['/plan-pruebas-langchain'], { queryParams: { grupo: this.grupoActivo } });
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
