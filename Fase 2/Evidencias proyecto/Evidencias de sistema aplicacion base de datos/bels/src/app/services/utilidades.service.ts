import { Injectable } from '@angular/core';
import { categoria } from '../modelos/tareas.model';
import { ModalController, ModalOptions } from '@ionic/angular';
import { __awaiter } from 'tslib';



@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {

  constructor(

    private modalController: ModalController
  ) { 

   


  }

  obtenerPorcentaje(categoria : categoria)
  {
    let actividadCompletado = categoria.actividad.filter(actividad => actividad.completo).length;
    let totalActividad = categoria.actividad.length;
    let porcentaje = (100/ totalActividad) * actividadCompletado

    return parseInt (porcentaje.toString())

  }

  async presentModal(opts: ModalOptions) {
    const modal = await this.modalController.create(opts)
    await modal.present();
    
    const {data} = await modal.onWillDismiss;
    if(data){

        return data;
    }
  }
dismissModal(data?: any){
    this.modalController.dismiss(data);
}

} 
  
    
  
  




