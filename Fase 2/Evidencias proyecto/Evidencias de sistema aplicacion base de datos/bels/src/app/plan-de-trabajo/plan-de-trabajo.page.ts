import { Component, OnInit } from '@angular/core';
import { planesTrabajo, preguntasPlanes } from '../Modelo/tareas.model';
import { Title } from '@angular/platform-browser';
import { ModalController, ModalOptions } from '@ionic/angular';
import { VerActividadesComponent } from '../componentes/ver-actividades/ver-actividades.component';
import { FirebaseService } from '../services/firebase.service';






@Component({
  selector: 'app-plan-de-trabajo',
  templateUrl: './plan-de-trabajo.page.html',
  styleUrls: ['./plan-de-trabajo.page.scss'],
})


export class PlanDeTrabajoPage implements OnInit {

  public planesTrabajos: planesTrabajo[] = [];



 constructor( private modalController : ModalController, private firebaseService: FirebaseService ) { }

 ngOnInit() {
  // Llamar a Firebase para obtener los campos idGrupo y plan
  this.firebaseService.getPlanTrabajo('xm6m5d7u1JSs74l4HbntvdmGkea2001x').subscribe(data => {
    this.planesTrabajos = [
      {
        idGrupo: data.idGrupo,
        titulo: "Autocuidado",
        descripcion: "Incluye hábitos como una buena alimentación, ejercicio, descanso y gestión del estrés.",
        preguntasPlanes: data.preguntasPlanes.map(p => ({ plan: p.plan, completo: false }))
      },
      // Puedes agregar más categorías si es necesario
    ];
    console.log(`idGrupo: ${data.idGrupo}, preguntasPlanes:`, data.preguntasPlanes);
  });
}






/*public categorias:  categoria[] =[

    {
      id: '1',
      titulo: "Autocuidado",
      descripcion: "Incluye hábitos como una buena alimentación, ejercicio, descanso y gestión del estrés.",
      actividad :[

        { nombre:   'asd', completo: false },
        { nombre: 'Actividad 2' , completo : false},
        { nombre: 'Actividad 3' , completo : false}
      ]
    },


    {
      id: '2',
      titulo: "Habilidades domesticas",
      descripcion : "Agregar descripción",
      actividad :[

        { nombre: 'Hacer la cama' , completo : false},
        { nombre: 'Actividad 2' , completo : false},
        { nombre: 'Actividad 3' , completo : false}
      ]
    },


    {
      id: '3',
      titulo: "Habilidades comunitarias",
      descripcion :  "Agregar descripción",
      actividad :[

        { nombre: 'No se me ocurre' , completo : false},
        { nombre: 'Actividad 2' , completo : false},
        { nombre: 'Actividad 3' , completo : false}
      ]
    },

    {
      id: '4',
      titulo: "Actividad y relaciones sociales",
      descripcion : "Agregar descripción",
      actividad :[

        { nombre: 'Almorzar en familia' , completo : false},
        { nombre: 'Actividad 2' , completo : false},
        { nombre: 'Actividad 3' , completo : false}
      ]
    }




] 

*/

 
 


 obtenerPorcentaje(planesTrabajo : planesTrabajo)
  {
    let actividadCompletado = planesTrabajo. preguntasPlanes.filter( preguntasPlanes =>  preguntasPlanes.completo).length;
    let totalActividad = planesTrabajo. preguntasPlanes.length;
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


  verTarea(planesTrabajo?: planesTrabajo) {
    this.presentModal({
      component: VerActividadesComponent,
      componentProps: { planesTrabajo }
    });
  }
}






    










  


 
  
     
  
  
  
  
  

    



  


