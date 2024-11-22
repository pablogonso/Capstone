import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seguimiento-mensual',
  templateUrl: './seguimiento-mensual.page.html',
  styleUrls: ['./seguimiento-mensual.page.scss'],
})
export class SeguimientoMensualPage implements OnInit {
  dias: any[] = []; // Lista de días con actividades
  idUsuario: string | null = null; // ID del usuario actualmente logueado

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  async ngOnInit() {
    try {
      // Obtener el ID del usuario logueado
      this.idUsuario = await this.firebaseService.obtenerIdUsuarioDocumento();
      if (!this.idUsuario) {
        console.error('No se pudo obtener el ID del usuario logueado.');
        return;
      }

      // Obtener las actividades desde Firebase
      const actividades = await this.firebaseService.obtenerActividadesDiarias(this.idUsuario);

      // Procesar las actividades: agrupar por fecha y clasificar por estado
      this.dias = this.agruparActividadesPorFecha(actividades);

      console.log('Días procesados con actividades:', this.dias);
    } catch (error) {
      console.error('Error al cargar las actividades:', error);
    }
  }

  // Método para agrupar actividades por fecha
  agruparActividadesPorFecha(actividades: any[]): any[] {
    const diasMap: { [fecha: string]: any } = {};

    actividades.forEach(actividad => {
      const fecha = this.formatFecha(actividad.Fecha); // Formatear la fecha
      if (!diasMap[fecha]) {
        diasMap[fecha] = { dia: fecha, completadas: [], noCompletadas: [], total: 0, expandido: false };
      }

      if (actividad.Completo) {
        diasMap[fecha].completadas.push(actividad.Actividad);
      } else {
        diasMap[fecha].noCompletadas.push(actividad.Actividad);
      }

      diasMap[fecha].total++;
    });

    // Convertir el objeto en un array
    return Object.values(diasMap);
  }

  // Formatear la fecha al formato "dd de mm de aaaa"
  formatFecha(fecha: Date): string {
    const opciones = { day: 'numeric', month: 'short', year: 'numeric' } as const;
    return fecha.toLocaleDateString('es-ES', opciones).replace('.', '');
  }

  // Cambiar el estado expandido del día seleccionado
  toggleDia(dia: any) {
    dia.expandido = !dia.expandido;
  }

  irAlHome() {
    this.router.navigate(['/pag-bienvenida']).then(() => {
      window.location.reload(); // Recarga la página actual
    });
  }

}
