import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanPruebasLangchainPageRoutingModule } from './plan-pruebas-langchain-routing.module';

import { PlanPruebasLangchainPage } from './plan-pruebas-langchain.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanPruebasLangchainPageRoutingModule
  ],
  declarations: [PlanPruebasLangchainPage]
})
export class PlanPruebasLangchainPageModule {}
