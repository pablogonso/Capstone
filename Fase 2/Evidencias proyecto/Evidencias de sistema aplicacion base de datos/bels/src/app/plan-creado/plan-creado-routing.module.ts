import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanCreadoPage } from './plan-creado.page';

const routes: Routes = [
  {
    path: '',
    component: PlanCreadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanCreadoPageRoutingModule {}
