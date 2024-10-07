import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagBienvenidaPageRoutingModule } from './pag-bienvenida-routing.module';

import { PagBienvenidaPage } from './pag-bienvenida.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagBienvenidaPageRoutingModule
  ],
  declarations: [PagBienvenidaPage]
})
export class PagBienvenidaPageModule {}
