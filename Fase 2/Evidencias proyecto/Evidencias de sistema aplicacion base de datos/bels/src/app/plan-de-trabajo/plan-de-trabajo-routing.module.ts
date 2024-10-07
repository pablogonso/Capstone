import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanDeTrabajoPage } from './plan-de-trabajo.page';

const routes: Routes = [
  {
    path: '',
    component: PlanDeTrabajoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanDeTrabajoPageRoutingModule {}
