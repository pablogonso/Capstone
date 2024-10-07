import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RealizarTestPageRoutingModule } from './realizar-test-routing.module';

import { RealizarTestPage } from './realizar-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RealizarTestPageRoutingModule
  ],
  declarations: [RealizarTestPage]
})
export class RealizarTestPageModule {}
