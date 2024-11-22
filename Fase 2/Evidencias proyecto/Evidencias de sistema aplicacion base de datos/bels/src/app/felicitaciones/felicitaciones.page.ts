import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-felicitaciones',
  templateUrl: './felicitaciones.page.html',
  styleUrls: ['./felicitaciones.page.scss'],
})
export class FelicitacionesPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  irAlHome() {
    this.router.navigate(['/pag-bienvenida']).then(() => {
      window.location.reload(); // Recarga la página actual
    });
  }
  
}
