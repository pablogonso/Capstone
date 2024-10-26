import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { register } from 'swiper/element/bundle';
import Swiper from 'swiper';

register();

@Component({
  selector: 'app-pag-bienvenida',
  templateUrl: './pag-bienvenida.page.html',
  styleUrls: ['./pag-bienvenida.page.scss'],
})
export class PagBienvenidaPage implements OnInit {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  ngOnInit() {
    const swiper = new Swiper('.swiper-container', {
      autoplay: {
        delay: 5000, // 5 segundos
        disableOnInteraction: false,
      },
      loop: true,
    });
  }

  logout() {
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
