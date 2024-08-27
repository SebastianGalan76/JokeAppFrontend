import { Injectable } from '@angular/core';
import { Category } from '../../model/Category';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private apiService: ApiService) { }

  
}
