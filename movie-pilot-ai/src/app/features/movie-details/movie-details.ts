import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, Input, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  finalize
} from 'rxjs/operators';
import { RecommendationsService } from '../../shared/services/recommendations-service';
import { RatingRoundPipe } from '../../shared/pipes/rating-round-pipe';
import { CommonLoader } from '../../shared/components/common-loader/common-loader';
@Component({
  selector: 'app-movie-details',
  imports: [CommonModule, RatingRoundPipe, CommonLoader],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss',
})

export class MovieDetails {
  genres: string[] = [];
  movie: any = {};
  similarMovies: any[] = [];

  private route = inject(ActivatedRoute);
  readonly isLoading = signal(false);
  readonly isLoadingSimilar = signal(false);

  constructor(

    private readonly recommendationsService: RecommendationsService
  ) { }
  ngOnInit() {
    this.route.paramMap
      .subscribe(params => {
        const movieId = params.get('id');
        console.log('Movie ID from route:', typeof movieId, movieId);

        if (movieId) {
          this.getMoviesById(movieId);
          this.getSimilarMoviesById(movieId);
        }
      });
  }

  getMoviesById(id: any): void {
    this.isLoading.set(true);
    this.recommendationsService.getMoviesById(id).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (response) => {
        this.movie = response;
        this.genres = response.genres.split('|');
      },
      error: (error) => {
        console.error('Login failed', error);
      },

    })

  }

  
  getSimilarMoviesById(id: any): void {
    this.isLoadingSimilar.set(true);
    this.recommendationsService.getSimilarMoviesById(id).pipe(
      finalize(() => this.isLoadingSimilar.set(false))
    ).subscribe({
      next: (response) => {
        this.similarMovies = response?.recommendations ?? [];
      },
      error: (error) => {
        console.error('Login failed', error);
      },

    })

  }

}
