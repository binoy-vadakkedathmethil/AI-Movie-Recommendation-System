import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RecommendationsService {
  constructor(private apiService: ApiService,) {
  }
  getPopularRecommendations(limit = 5) : Observable<any> {
    return this.apiService.get(`/movies/popular?limit=${limit}`)
  }
  
  searchMovies(
    query: string,
    limit: number = 10
  ): Observable<any> {

    return this.apiService.get(
      `/recommendations/search?query=${encodeURIComponent(query)}&limit=${limit}`
    );
  }

  getMoviesByGenre(
    query: string,
    limit: number = 5
  ): Observable<any> {

    return this.apiService.get(
      `/recommendations/by-genre?genre=${encodeURIComponent(query)}&limit=${limit}`
    );
  }

}
