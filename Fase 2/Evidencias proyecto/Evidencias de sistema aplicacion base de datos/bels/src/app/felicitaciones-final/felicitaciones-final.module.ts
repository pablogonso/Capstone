import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FelicitacionesFinalPageRoutingModule } from './felicitaciones-final-routing.module';

import { FelicitacionesFinalPage } from './felicitaciones-final.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FelicitacionesFinalPageRoutingModule
  ],
  declarations: [FelicitacionesFinalPage]
})
export class FelicitacionesFinalPageModule {}
