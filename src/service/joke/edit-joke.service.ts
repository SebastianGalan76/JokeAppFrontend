import { Injectable } from '@angular/core';
import { Category } from '../../model/Category';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditJokeService {
  
  constructor(private apiService: ApiService){}

  edit(id: number, content: string, type: string, kind: string, categories: Category[]) : Observable<Response>{
    return this.apiService.put<Response>('/joke/'+id,
      {
        content: content,
        type: type,
        kind: kind,
        categories: categories
      }, {withCredentials: true}
    )
  }
}
