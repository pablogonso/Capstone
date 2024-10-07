import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanDeTrabajoPageRoutingModule } from './plan-de-trabajo-routing.module';

import { PlanDeTrabajoPage } from './plan-de-trabajo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanDeTrabajoPageRoutingModule
  ],
  declarations: [PlanDeTrabajoPage]
})
export class PlanDeTrabajoPageModule {}
