import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import translations from '../../language/translations';

import {
  ValidatorFn,
  FormControl,
  FormGroupDirective,
  AbstractControl,
  FormGroup,
  NgForm,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

const _window: any = window;

function matchValues(value1: string, value2: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control?.get(value1)?.value !== control?.get(value2)?.value) {
      return { matchValues: true };
    }
    _window.control = control;

    return null;
  };
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor(private http: HttpClient) {
    this.http
      .get(`${environment.backendUri}/auth/validateSession`, {
        withCredentials: true,
      })
      .subscribe(
        (res: any) => {
          _window.location.href = '/dashboard';
        },
        (err) => {
          this.loading = false;
        }
      );
  }

  translations: any = translations;
  language: string = 'eng';
  email: string = '';
  loading: boolean = true;
  password: string = '';
  passwordConfirm: string = '';
  userHasAnAccount: boolean = true;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    matchValues('password', 'passwordConfirm'),
  ]);

  matcher = new MyErrorStateMatcher();

  signin = () => {
    this.http
      .post(
        `${environment.backendUri}/auth/signin`,
        {
          username: this.email,
          password: this.password,
        },
        { withCredentials: true }
      )
      .subscribe((res: any) => {
        _window.location.href = '/dashboard';
      });
  };

  signup = () => {
    this.http
      .post(
        `${environment.backendUri}/auth/signup`,
        {
          username: this.email,
          password: this.password,
          passwordConfirm: this.passwordConfirm,
        },
        { withCredentials: true }
      )
      .subscribe((res: any) => {
        _window.location.href = '/dashboard';
      });
  };

  ngOnInit(): void {}
}
