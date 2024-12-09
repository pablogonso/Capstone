import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ActividadesComponent } from './actividades.component';

@NgModule({
  declarations: [ActividadesComponent], 
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [ActividadesComponent] // 
})
export class ActividadesModule { }
