import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  irARegistrarse() {
    this.router.navigate(['/ingresar-datos']);
  }
  
  onSubmit() {
    console.log('Email:', this.email);
    console.log('Contraseña:', this.password);
    
    // Aquí puedes añadir la lógica para autenticar al usuario.
    // Si la autenticación es exitosa, redirige al usuario a otra página.
    // this.router.navigate(['/pagina-deseada']);
  }
}
