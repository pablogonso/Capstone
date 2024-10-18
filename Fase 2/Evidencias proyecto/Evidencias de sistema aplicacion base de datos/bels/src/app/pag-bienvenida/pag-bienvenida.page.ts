import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-pag-bienvenida',
  templateUrl: './pag-bienvenida.page.html',
  styleUrls: ['./pag-bienvenida.page.scss'],
})
export class PagBienvenidaPage implements OnInit {

  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  irArealizartest(){
    this.router.navigate(['/realizar-test'])
  }
  irA(){
    this.router.navigate(['/ver-resultados'])
  }
  irApagebienvenida(){
    this.router.navigate(['/plan-de-trabajo'])
  }
  
  logout() {
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']); // Redirigir al login después de cerrar sesión
    });
  }

  ngOnInit() {
  }

}
