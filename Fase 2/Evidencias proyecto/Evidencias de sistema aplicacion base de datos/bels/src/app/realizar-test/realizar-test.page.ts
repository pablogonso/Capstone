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
  grupoActivo: string = ''; // Declarado sin valor inicial para establecerlo desde los queryParams
  respuestasId: string = '';
  guardando: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private belsService: BelsService,
    private firebaseService: FirebaseService
  ) {}

  async ngOnInit() {
    // Obtener el grupo desde los queryParams
    this.route.queryParams.subscribe(params => {
      this.grupoActivo = params['grupo'] || 'Autocuidado'; // Usa el grupo del queryParams o "Autocuidado" como valor predeterminado
      console.log("Grupo activo establecido desde queryParams:", this.grupoActivo);
      this.obtenerPreguntasPorGrupo(); // Cargar las preguntas basadas en el grupo recibido
    });

    // Obtener el ID del usuario actual
    const usuarioIdDocumento = await this.obtenerIdUsuarioActual();
    if (!usuarioIdDocumento) {
      console.error("No se pudo obtener el ID del usuario actual.");
      return;
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
    if (this.guardando) return;
    this.guardando = true;

    const respuestasArray = this.preguntas.map(pregunta => ({
      pregunta: pregunta.pregunta,
      valor: pregunta.valor,
      estado: pregunta.estado
    }));

    const grupo = this.grupoActivo;
    const usuarioIdDocumento = await this.obtenerIdUsuarioActual();

    if (!usuarioIdDocumento) {
      console.error("No se pudo obtener el ID de usuario actual para guardar las respuestas.");
      this.guardando = false;
      return;
    }

    try {
      const idPersonalizado = await this.firebaseService.generarIdRespuesta(usuarioIdDocumento);
      console.log(`ID personalizado generado: ${idPersonalizado}`);
      
      await this.firebaseService.guardarRespuestasGrupoConId(usuarioIdDocumento, grupo, respuestasArray, idPersonalizado);
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
    const todasRespondidas = this.preguntas.every(pregunta => pregunta.estado === true);
    if (!todasRespondidas) return;

    const puntajeMaximo = this.obtenerPuntajeMaximoPorGrupo(this.grupoActivo);
    const puntajeActual = this.calcularPuntajeTotal(this.preguntas);

    console.log(`Puntaje actual: ${puntajeActual}, Puntaje máximo: ${puntajeMaximo}`);

    if (puntajeActual >= puntajeMaximo) {
      console.log(`Puntaje máximo alcanzado para el grupo: ${this.grupoActivo}. Desbloqueando el siguiente grupo.`);
      await this.guardarYAvanzarGrupo();
    } else {
      console.log(`Puntaje insuficiente en el grupo: ${this.grupoActivo}. Redirigiendo a Generar plan de trabajo.`);
      await this.enviarFormulario();
      this.router.navigate(['/plan-pruebas-langchain']);
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
