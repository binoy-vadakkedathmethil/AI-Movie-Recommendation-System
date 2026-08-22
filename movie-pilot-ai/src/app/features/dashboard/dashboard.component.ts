import { Component, computed, DestroyRef, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie, gradientAt } from '../../shared/models/movie.model';
import {MatMenuModule} from '@angular/material/menu';
import { TokenService } from '../../core/services/token.service';
import { Router } from '@angular/router';
import { RecommendationsService } from '../../shared/services/recommendations-service';
import { CommonLoader } from '../../shared/components/common-loader/common-loader';
import { of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  finalize
} from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RatingRoundPipe } from '../../shared/pipes/rating-round-pipe';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,MatMenuModule,CommonLoader,RatingRoundPipe,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  popularMovies = signal<any[]>([]);
  moviesByGenres = signal<any[]>([]);
  readonly isLoading = signal(false);
  errorMessage = signal('');
    readonly moviesWithGradient = computed(() =>
      this.popularMovies().map((movie, index) => ({
        ...movie,
        gradient: gradientAt(index)
      }))
    );
    readonly genresWithGradient = computed(() =>
      this.moviesByGenres().map((movie, index) => ({
        ...movie,
        gradient: gradientAt(index)
      }))
    );


constructor(
    private readonly tokenService: TokenService,
     private readonly router: Router,
     private readonly recommendationsService: RecommendationsService
  ) {}
  ngOnInit(): void {
    this.getPopularRecommendations();
    this.getMoviesByGenre();

  }

  getPopularRecommendations(): void {
    this.isLoading.set(true);
    console.log('getPopularRecommendations called');
    this.recommendationsService.getPopularRecommendations().pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
          next: (response) => {
            this.popularMovies.set(response?.recommendations || []);
            console.log('Popular Recommendations:', this.popularMovies());
          },
          error: (error) => {
            console.error('Login failed', error);
          },
        
    })
    
  }

  getMoviesByGenre(): void {
    this.isLoading.set(true);
    this.recommendationsService.getMoviesByGenre('action').pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
          next: (response) => {
            this.moviesByGenres.set(response || []);
            console.log('Movies by Genre:', this.moviesByGenres());
          },
          error: (error) => {
            console.error('Login failed', error);
          },
        
    })
    
  }

 

selectedMovie(movie: any): void {
  this.router.navigate(['/app/movie', movie.movieId]);
  console.log('Selected movie:', movie);
}
  
}
