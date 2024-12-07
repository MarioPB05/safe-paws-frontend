import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {QuestionsAvailable} from '@core/models/question.model';
import {Observable} from 'rxjs';

@Injectable(
    {providedIn: 'root'}
)
export class QuestionService {

  constructor(private http: HttpClient) { }

  getQuestions(): Observable<QuestionsAvailable[]> {
    return this.http.get<QuestionsAvailable[]>('/api/questions/');
  }
}
