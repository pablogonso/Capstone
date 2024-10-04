import { Component, OnInit, signal } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from 'src/environments/environment.prod';

const googleGenAI = new GoogleGenerativeAI(environment.gemini.API_KEY);
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 100,
  responseMimeType: "text/plain"
};

const model = googleGenAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  ...generationConfig
});

@Component({
  selector: 'app-plan-pruebas',
  templateUrl: './plan-pruebas.page.html',
  styleUrls: ['./plan-pruebas.page.scss'],
})

export class PlanPruebasPage implements OnInit {
  result = signal('');
  userInput: string = ''; // Variable para almacenar el texto del usuario

  constructor() {}

  ngOnInit(): void {}

  async onSubmit() {
    if (this.userInput) {
      const inputInSpanish = `Por favor, responde en español: ${this.userInput}`;
      await this.TestGemini(inputInSpanish);
    } else {
      this.result.set("Por favor ingresa un texto.");
    }
  }

  async TestGemini(userText: string) {
    try {
      const result = await model.generateContent(userText);
      const response = result.response;
      this.result.set(response.text());
    } catch (error) {
      this.result.set("Ocurrió un error al comunicarse con Gemini.");
      console.error("Error en Gemini API:", error);
    }
  }
}
