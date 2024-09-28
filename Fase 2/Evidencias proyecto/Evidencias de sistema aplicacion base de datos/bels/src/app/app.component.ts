import { Component, OnInit, signal } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from 'src/environments/environment.prod';

const googleGenAI = new GoogleGenerativeAI(environment.gemini.API_KEY);
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 500,
  responseMimeType: "text/plain"
}

const model = googleGenAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  ...generationConfig
});

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit{
  result = signal('');

ngOnInit(): void {
  this.TestGemini();
  }

async TestGemini(){
  const prompt = 'Dame la planificación de una clase de historia de América para 2 días';
  const result = await model.generateContent(prompt);
  const response = result.response;
  this.result.set(response.text());
  }
}