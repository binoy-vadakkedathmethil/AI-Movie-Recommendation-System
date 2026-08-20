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
  private destroyRef = inject(DestroyRef);
 searchControl = new FormControl('', {
    nonNullable: true
  });
    searchResults = signal<any[]>([]);
  isSearching = signal(false);

constructor(
    private readonly tokenService: TokenService,
     private readonly router: Router,
     private readonly recommendationsService: RecommendationsService
  ) {}
  ngOnInit(): void {
    this.getPopularRecommendations();
    this.getMoviesByGenre();
   this.searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),

  switchMap(query => {
    const search = query.trim();

    if (!search) {
      this.isSearching.set(false);
      this.searchResults.set([]);

      return of({
        query: '',
        count: 0,
        movies: []
      });
    }

    this.isSearching.set(true);

    return this.recommendationsService
      .searchMovies(search, 10)
      .pipe(
        catchError(error => {
          console.error('Search error:', error);

          this.searchResults.set([]);
          this.isSearching.set(false);

          return of({
            query: search,
            count: 0,
            movies: []
          });
        })
      );
  }),

  takeUntilDestroyed(this.destroyRef)
).subscribe(response => {
  this.searchResults.set(response ?? []);
  this.isSearching.set(false);
});
  }
  gotoDshboard(): void {
     this.router.navigate(['/dashboard']);
  }
  

  nolanPicks: Movie[] = [
    { title: 'The Dark Knight', rating: 9.0, match: '93% Match', gradient: gradientAt(2) },
    { title: 'Memento', rating: 8.4, match: '90% Match', gradient: gradientAt(3) },
    { title: 'Tenet', rating: 7.3, match: '90% Match', gradient: gradientAt(4) },
    { title: 'Dunkirk', rating: 7.8, match: '88% Match', gradient: gradientAt(5) },
    { title: 'Inception', rating: 8.8, match: '93% Match', gradient: gradientAt(0) },
  ];

  assistantPicks: Movie[] = [
    { title: 'Arrival', rating: 8.0, match: '', gradient: gradientAt(0) },
    { title: 'Gravity', rating: 7.7, match: '', gradient: gradientAt(1) },
    { title: 'The Martian', rating: 8.0, match: '', gradient: gradientAt(2) },
  ];

  moodPicks: Movie[] = [
    { title: 'The Martian', rating: 0, match: '', gradient: gradientAt(1) },
    { title: 'Ex Machina', rating: 0, match: '', gradient: gradientAt(2) },
    { title: 'Source Code', rating: 0, match: '', gradient: gradientAt(3) },
    { title: 'Looper', rating: 0, match: '', gradient: gradientAt(4) },
  ];

  genres = [
    { label: 'Sci-Fi', cls: 'p-purple' },
    { label: 'Thriller', cls: 'p-blue' },
    { label: 'Mystery', cls: 'p-pink' },
    { label: 'Drama', cls: 'p-amber' },
    { label: 'Adventure', cls: 'p-teal' },
  ];

  askAi(): void {
    alert('Ask AI Anything');
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
  logout():void{
    this.tokenService.logout();
  }
  clearSearch(): void {
  this.searchControl.setValue('', {
    emitEvent: false
  });

  this.searchResults.set([]);
}
selectMovie(movie: any): void {
  this.searchControl.setValue(movie.title, {
    emitEvent: false
  });

  this.searchResults.set([]);
}
  
}
