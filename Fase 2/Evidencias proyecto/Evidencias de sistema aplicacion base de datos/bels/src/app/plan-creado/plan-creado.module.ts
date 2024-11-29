import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanCreadoPageRoutingModule } from './plan-creado-routing.module';

import { PlanCreadoPage } from './plan-creado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanCreadoPageRoutingModule
  ],
  declarations: [PlanCreadoPage]
})
export class PlanCreadoPageModule {}
