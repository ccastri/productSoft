import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

declare const gapi: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public formSubmitted = false;
  public auth2: any;

  public loginForm: any = this.fb.group({
    email: [
      localStorage.getItem('email') || '',
      [Validators.required, Validators.email],
    ], // Correo existente en localStorage || string vacio (evitar el null)
    password: ['', Validators.required],
    rememberMe: [false],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    // this.renderButton();
  }
  //manejo del formulario

  // login() {
  //   const { email, password } = this.loginForm.value;
  //   this.userService
  //     .login(email, password)
  //     .then(() => {
  //       if (this.loginForm.get('rememberMe').value) {
  //         localStorage.setItem('email', email);
  //       } else {
  //         localStorage.removeItem('email');
  //       }
  //       Swal.fire('Completado', 'Usuario Autenticado', 'success');
  //       this.ngZone.run(() => {
  //         this.router.navigateByUrl('/');
  //       });
  //     })
  //     .catch((error) => {
  //       Swal.fire('Error', error.message, 'error');
  //     });
  // }
  //! Updated Async/Await login:
  async login() {
    const { email, password } = this.loginForm.value;
    try {
      await this.userService.login(email, password);

      if (this.loginForm.get('rememberMe').value) {
        localStorage.setItem('email', email);
      } else {
        localStorage.removeItem('email');
      }

      Swal.fire('Completado', 'Usuario Autenticado', 'success');
      this.ngZone.run(() => {
        this.router.navigateByUrl('/');
      });
    } catch (error: any) {
      Swal.fire('Error', error.message, 'error');
    }
  }
}

