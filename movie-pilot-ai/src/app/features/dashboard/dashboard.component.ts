import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie, gradientAt } from '../../shared/models/movie.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  @Input() userName = 'Binoy';

  topPicks: any[] = [
    { title: 'Dune: Part Two', rating: 8.5, match: 'Match', gradient: gradientAt(0) },
    { title: 'Interstellar', rating: 8.6, match: 'Match', gradient: gradientAt(1) },
    { title: 'Inception', rating: 8.8, match: 'Match', gradient: gradientAt(2) },
    { title: 'The Prestige', rating: 8.5, match: '91% Match', gradient: gradientAt(3) },
    { title: 'Arrival', rating: 8.0, match: 'Match', gradient: gradientAt(4) },
  ];

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
}
