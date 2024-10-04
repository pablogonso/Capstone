import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PlanPruebasPageRoutingModule } from './plan-pruebas-routing.module';
import { PlanPruebasPage } from './plan-pruebas.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanPruebasPageRoutingModule
  ],
  declarations: [PlanPruebasPage]
})
export class PlanPruebasPageModule {}
