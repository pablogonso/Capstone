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
})
export class PagBienvenidaPage implements OnInit {
  idUsuario: string | null = null; // Variable para almacenar el ID de usuario
  botonRealizarTestHabilitado: boolean = false; // Nueva variable para controlar el botón

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

    // Obtiene el ID del usuario y verifica el estado del último plan de trabajo
    this.idUsuario = await this.firebaseService.obtenerIdUsuarioDocumento();
    console.log('ID de usuario detectado:', this.idUsuario);

    // Verificar el estado del último plan de trabajo si el usuario está logueado
    if (this.idUsuario) {
      const ultimoPlan = await this.firebaseService.obtenerUltimoPlanTrabajo(this.idUsuario);
      console.log("Último plan de trabajo obtenido:", ultimoPlan); // Log para verificar el plan más reciente

      // Verificar si planCompletado es true o false y ajustar el botón
      if (ultimoPlan) {
        this.botonRealizarTestHabilitado = ultimoPlan.planCompletado === true;
        console.log("Valor de planCompletado:", ultimoPlan.planCompletado);
        console.log("Estado de botonRealizarTestHabilitado:", this.botonRealizarTestHabilitado);
      } else {
        // Si no hay un plan previo, habilita el botón para el primer test
        this.botonRealizarTestHabilitado = true;
        console.log("No se encontró un plan anterior, habilitando el botón para el primer test.");
      }
    }
  }

  logout() {
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
