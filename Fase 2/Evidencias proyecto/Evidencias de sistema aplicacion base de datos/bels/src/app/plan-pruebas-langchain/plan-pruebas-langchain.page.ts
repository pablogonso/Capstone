import { Component } from '@angular/core';
import { LangchainService } from '../services/langchain.service';

@Component({
  selector: 'app-plan-pruebas-langchain',
  templateUrl: './plan-pruebas-langchain.page.html',
  styleUrls: ['./plan-pruebas-langchain.page.scss'],
})
export class PlanPruebasLangchainPage {
  inputText: string = '';
  response: string = '';

  constructor(private langchainService: LangchainService) {}

  getLLMResponse() {
    this.langchainService.callLLM(this.inputText).subscribe((data: any) => {
      this.response = data.response;
    }, error => {
      console.error('Error:', error);
    });
  }
}
