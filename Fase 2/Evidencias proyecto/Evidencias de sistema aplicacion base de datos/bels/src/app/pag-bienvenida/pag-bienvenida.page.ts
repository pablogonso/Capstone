import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pag-bienvenida',
  templateUrl: './pag-bienvenida.page.html',
  styleUrls: ['./pag-bienvenida.page.scss'],
})
export class PagBienvenidaPage implements OnInit {

  constructor(private router: Router) { }

  irArealizartest(){
    this.router.navigate(['/realizar-test'])
  }
  irA(){
    this.router.navigate(['/ver-resultados'])
  }
  irApagebienvenida(){
    this.router.navigate(['/plan-de-trabajo'])
  }
  
 

  ngOnInit() {
  }

}
