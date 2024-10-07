import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LangchainService {
  private apiUrl = 'http://127.0.0.1:5000/api/model';  // URL del backend Flask

  constructor(private http: HttpClient) {}

  callLLM(inputText: string): Observable<any> {
    return this.http.post(this.apiUrl, { input_text: inputText });
  }
}
