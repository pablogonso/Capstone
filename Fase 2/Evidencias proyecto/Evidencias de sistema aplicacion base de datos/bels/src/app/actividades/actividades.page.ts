import { Component, NgModule, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ModalController, ModalOptions } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { BelsService } from '../services/question.service'; // Asegúrate de que la ruta es correcta
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importar AngularFirestore para trabajar con Firebase
import { Router } from '@angular/router';




@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.page.html',
  styleUrls: ['./actividades.page.scss'],
})



export class ActividadesPage implements OnInit {
  

  constructor(private router: Router, private firestore: AngularFirestore) { }

  ngOnInit() {

    
  }


  
  

  
}    




