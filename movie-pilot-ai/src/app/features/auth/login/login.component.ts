import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { confirmPasswordMatchValidator } from '../../../shared/validators/confirm-password-match.validator';
import { passwordStrengthValidator } from '../../../shared/validators/password-strength.validator';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private _snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  isLogin = signal<boolean>(true);
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), passwordStrengthValidator]],
      confirmPassword: ['', Validators.required]
    }, { validators: confirmPasswordMatchValidator });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this._snackBar.open('Please fill in all required fields correctly.', 'Close');
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login submitted', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }


  onSignupSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this._snackBar.open('Please fill in all required fields correctly.', 'Close');
      return;
    }
    const payload = {
        username: this.registerForm.get('name')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
   }

    this.authService.register(payload).subscribe({
      next: (response) => {
        if(response?.success){
            this._snackBar.open('Registration successful! Please log in.', 'Close');
            this.isLogin.set(true);
        }
      },
      error: (error) => {
        console.error('Registration failed', error);
      }
    });
  }
}
