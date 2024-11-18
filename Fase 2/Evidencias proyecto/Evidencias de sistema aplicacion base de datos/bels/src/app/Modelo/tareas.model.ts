export interface planesTrabajo {
    titulo: string
    // nombre: string,
    descripcion: string,
    idGrupo: string,
    idUsuario: string,
    // idPlan: string,

    preguntasPlanes: preguntasPlanes[];


}

export interface preguntasPlanes {

    plan: string,
    completo: boolean,
    //  pregunta :  string,
    //   puntaje : number,

}


