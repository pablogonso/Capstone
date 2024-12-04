import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-felicitaciones-final',
  templateUrl: './felicitaciones-final.page.html',
  styleUrls: ['./felicitaciones-final.page.scss'],
})

export class FelicitacionesFinalPage implements OnInit {
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