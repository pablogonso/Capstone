import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-plan-creado',
  templateUrl: './plan-creado.page.html',
  styleUrls: ['./plan-creado.page.scss'],
})
export class PlanCreadoPage implements OnInit{
  constructor(private router: Router) {}

  ngOnInit() {
    this.lanzarConfetti();
  }

  lanzarConfetti() {
    confetti({
      particleCount: 1000,
      spread: 150,
      origin: { y: 0.6 }, // Altura desde donde inicia el confetti
    });
  }
  
  irAlInicio() {
    this.router.navigate(['/pag-bienvenida']).then(() => {
      window.location.reload();
    });
  }
}
