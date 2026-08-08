import { AbstractControl, ValidationErrors } from '@angular/forms';

export const passwordStrengthValidator = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;

  if (!value || typeof value !== 'string') {
    return null;
  }

  const hasUpperCase = /[A-Z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSymbol = /[^A-Za-z0-9]/.test(value);

  if (value.length < 8 || !hasUpperCase || !hasNumber || !hasSymbol) {
    return { weakPassword: true };
  }

  return null;
};
