import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-felicitaciones',
  templateUrl: './felicitaciones.page.html',
  styleUrls: ['./felicitaciones.page.scss'],
})
export class FelicitacionesPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(){
    this.lanzarConfetti();
   }

  irAlHome() {
    this.router.navigate(['/pag-bienvenida']).then(() => {
      window.location.reload(); // Recarga la página actual
    });
  }

  lanzarConfetti() {
    confetti({
      particleCount: 1000,
      spread: 150,
      origin: { y: 0.6 }, // Altura desde donde inicia el confetti
    });
  }
  
}

