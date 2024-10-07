import { Component, OnInit } from '@angular/core';
import { BelsService } from '../services/question.service'; // Asegúrate de que la ruta es correcta

@Component({
  selector: 'app-realizar-test',
  templateUrl: './realizar-test.page.html',
  styleUrls: ['./realizar-test.page.scss'],
})
export class RealizarTestPage implements OnInit {
  preguntas: any[] = [];

  constructor(private belsService: BelsService) { }

  ngOnInit() {
    // Llamar al servicio para obtener las preguntas cuando se cargue el componente
    this.belsService.getPreguntas().subscribe(data => {
      console.log('Preguntas obtenidas:', data); // Verificar si los datos llegan
      this.preguntas = data;
    });
  }
}
