import { Component, computed, DestroyRef, inject, Input, signal } from '@angular/core';

import {MatMenuModule} from '@angular/material/menu';
import { TokenService } from '../../../core/services/token.service';
import { RouterLink, RouterLinkActive, RouterOutlet ,Router } from '@angular/router';
import { RecommendationsService } from '../../services/recommendations-service';

import { of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  finalize
} from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Movie, gradientAt } from '../../models/movie.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule,MatMenuModule,
     ReactiveFormsModule,
     MatAutocompleteModule,
     MatInputModule,
     MatProgressSpinnerModule,
      RouterOutlet
   ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
    readonly isLoading = signal(false);
    errorMessage = signal('');
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
       this.router.navigate(['/app/dashboard']);
    }
    
  
    
    genres = [
      { label: 'Sci-Fi', cls: 'p-purple' },
      { label: 'Thriller', cls: 'p-blue' },
      { label: 'Mystery', cls: 'p-pink' },
      { label: 'Drama', cls: 'p-amber' },
      { label: 'Adventure', cls: 'p-teal' },
    ];
  
   
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
     this.router.navigate(['/app/movie', movie.movieId]);
  }
  

}
