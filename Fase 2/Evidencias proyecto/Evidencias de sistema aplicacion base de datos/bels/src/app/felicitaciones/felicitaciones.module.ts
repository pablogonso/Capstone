import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FelicitacionesPageRoutingModule } from './felicitaciones-routing.module';

import { FelicitacionesPage } from './felicitaciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FelicitacionesPageRoutingModule
  ],
  declarations: [FelicitacionesPage]
})
export class FelicitacionesPageModule {}
