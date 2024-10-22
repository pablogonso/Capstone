import { Component, OnInit } from '@angular/core';
import { actividad, categoria } from '../Modelo/tareas.model';
import { Title } from '@angular/platform-browser';
import { ModalController, ModalOptions } from '@ionic/angular';
import { VerActividadesComponent } from '../componentes/ver-actividades/ver-actividades.component';





@Component({
  selector: 'app-plan-de-trabajo',
  templateUrl: './plan-de-trabajo.page.html',
  styleUrls: ['./plan-de-trabajo.page.scss'],
})


export class PlanDeTrabajoPage implements OnInit {

public categorias:  categoria[] =[

    {
      id: '1',
      titulo: "Autocuidado",
      descripcion : "Agregar descripcion",
      actividad :[

        { nombre: 'Bañarse' , completo : true},
        { nombre: 'Actividad 2' , completo : false},
        { nombre: 'Actividad 3' , completo : false}
      ]
    },


    {
      id: '2',
      titulo: "Habilidades domesticas",
      descripcion : "Agregar descripción",
      actividad :[

        { nombre: 'Hacer la cama' , completo : true},
        { nombre: 'Actividad 2' , completo : true},
        { nombre: 'Actividad 3' , completo : false}
      ]
    },


    {
      id: '3',
      titulo: "Habilidades comunitarias",
      descripcion :  "Agregar descripción",
      actividad :[

        { nombre: 'No se me ocurre' , completo : true},
        { nombre: 'Actividad 2' , completo : false},
        { nombre: 'Actividad 3' , completo : false}
      ]
    },

    {
      id: '4',
      titulo: "Actividad y relaciones sociales",
      descripcion : "Agregar descripción",
      actividad :[

        { nombre: 'Almorzar en familia' , completo : true},
        { nombre: 'Actividad 2' , completo : false},
        { nombre: 'Actividad 3' , completo : false}
      ]
    }




] 



  constructor( private modalController : ModalController,) { }



  ngOnInit() {}


  obtenerPorcentaje(categoria : categoria)
  {
    let actividadCompletado = categoria.actividad.filter(actividad => actividad.completo).length;
    let totalActividad = categoria.actividad.length;
    let porcentaje = (100 / totalActividad) * actividadCompletado

    return parseInt (porcentaje.toString())

  }

//Modal
  async presentModal(opts:ModalOptions){
    const modal = await this.modalController.create(opts);
    await modal.present();

    const {data} = await modal.onWillDismiss();

    if(data){
      return data;

    }
  }

  dismissModal(data : any){
    this.modalController.dismiss(data);

  }


  verTarea(categoria?: categoria) {
    this.presentModal({
      component: VerActividadesComponent,
      componentProps: { categoria }
    });
  }
}


    










  


 
  
     
  
  
  
  
  

    



  


