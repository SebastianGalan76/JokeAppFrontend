import { Injectable } from '@angular/core';
import { Category } from '../../model/Category';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateJokeService {
  
  constructor(private apiService: ApiService){}

  create(content: string, type: string, kind: string, category: Category | null) : Observable<Response>{
    return this.apiService.post<Response>('/joke/create',
      {
        content: content,
        type: type,
        kind: kind,
        category: category
      }, {withCredentials: true}
    )
  }
}
