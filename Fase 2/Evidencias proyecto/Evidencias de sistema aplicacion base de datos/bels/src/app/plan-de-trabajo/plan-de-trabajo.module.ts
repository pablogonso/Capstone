import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { IonicModule } from '@ionic/angular';

import { PlanDeTrabajoPageRoutingModule } from './plan-de-trabajo-routing.module';

import { PlanDeTrabajoPage } from './plan-de-trabajo.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PlanDeTrabajoPageRoutingModule,
    RouterModule,
    NgCircleProgressModule.forRoot({
      
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
      
    })

  ],
  declarations: [PlanDeTrabajoPage]
})
export class PlanDeTrabajoPageModule {}
