import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerResultadosPageRoutingModule } from './ver-resultados-routing.module';

import { VerResultadosPage } from './ver-resultados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerResultadosPageRoutingModule
  ],
  declarations: [VerResultadosPage]
})
export class VerResultadosPageModule {}
