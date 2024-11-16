import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { register } from 'swiper/element/bundle';
import Swiper from 'swiper';
import { FirebaseService } from '../services/firebase.service';

register();

@Component({
  selector: 'app-pag-bienvenida',
  templateUrl: './pag-bienvenida.page.html',
  styleUrls: ['./pag-bienvenida.page.scss'],
})export class PagBienvenidaPage implements OnInit {
  idUsuario: string | null = null; // Variable para almacenar el ID de usuario
  nombreUsuario: string | null = null; // Nueva variable para almacenar el nombre del usuario
  botonRealizarTestHabilitado: boolean = false; // Control del botón

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private firebaseService: FirebaseService // Inyecta el servicio FirebaseService
  ) {}

  async ngOnInit() {
    // Configuración del Swiper
    const swiper = new Swiper('.swiper-container', {
      autoplay: {
        delay: 5000, // 5 segundos
        disableOnInteraction: false,
      },
      loop: true,
    });

    // Obtiene el ID del usuario
    this.idUsuario = await this.firebaseService.obtenerIdUsuarioDocumento();
    console.log('ID de usuario detectado:', this.idUsuario);

    // Obtiene el nombre del usuario
    if (this.idUsuario) {
      this.nombreUsuario = await this.firebaseService.obtenerNombreUsuario();
      console.log('Nombre del usuario:', this.nombreUsuario);
    }

    // Verificar el estado del último plan de trabajo
    if (this.idUsuario) {
      const ultimoPlan = await this.firebaseService.obtenerUltimoPlanTrabajo(this.idUsuario);
      console.log('Último plan de trabajo obtenido:', ultimoPlan);

      // Ajustar el botón basado en el estado del último plan de trabajo
      if (ultimoPlan) {
        this.botonRealizarTestHabilitado = ultimoPlan.planCompletado === true;
        console.log('Estado de botonRealizarTestHabilitado:', this.botonRealizarTestHabilitado);
      } else {
        this.botonRealizarTestHabilitado = true;
        console.log('No se encontró un plan anterior, habilitando el botón para el primer test.');
      }
    }
  }

  logout() {
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
