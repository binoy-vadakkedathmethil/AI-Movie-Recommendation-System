import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecommendationsService {
  constructor(private apiService: ApiService,) {
  }
  getPopularRecommendations() : Observable<any> {
    return this.apiService.get('/recommendations/popular')
  }
  
}
