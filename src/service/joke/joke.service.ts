import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class JokeService {
  constructor(private apiService: ApiService) { }

  like(id: number){
    this.apiService.post<Response>('/joke/'+id+"/like", null, {withCredentials: true}).subscribe();
  }

  dislike(id: number){
    this.apiService.post<Response>('/joke/'+id+"/dislike", null, {withCredentials: true}).subscribe();
  }

  favorite(id: number){
    this.apiService.post<Response>('/joke/favorite/'+id, null, {withCredentials: true}).subscribe();
  }

  delete(id: number){
    this.apiService.delete<Response>('/joke/'+id, {withCredentials: true}).subscribe();
  }
}
