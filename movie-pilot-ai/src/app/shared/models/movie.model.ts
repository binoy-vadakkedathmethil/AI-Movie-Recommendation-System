export interface Movie {
  title: string;
  rating: number;
  match: string;
  gradient: string;
}

export const POSTER_GRADIENTS: string[] = [
  'linear-gradient(160deg,#3a2a12,#0a0a12 70%)',
  'linear-gradient(160deg,#132a3a,#0a0a12 70%)',
  'linear-gradient(160deg,#2a1230,#0a0a12 70%)',
  'linear-gradient(160deg,#123a2c,#0a0a12 70%)',
  'linear-gradient(160deg,#301616,#0a0a12 70%)',
  'linear-gradient(160deg,#1c1c3a,#0a0a12 70%)',
];

export function gradientAt(i: number): string {
  return POSTER_GRADIENTS[i % POSTER_GRADIENTS.length];
}
