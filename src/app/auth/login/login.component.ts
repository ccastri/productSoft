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

  login() {
    const { email, password } = this.loginForm.value;
    this.userService
      .login(email, password)
      .then(() => {
        if (this.loginForm.get('rememberMe').value) {
          localStorage.setItem('email', email);
        } else {
          localStorage.removeItem('email');
        }
        Swal.fire('Completado', 'Usuario Autenticado', 'success');
        this.ngZone.run(() => {
          this.router.navigateByUrl('/');
        });
      })
      .catch((error) => {
        Swal.fire('Error', error.message, 'error');
      });
  }
}
//     next: (resp) => {
//       console.log(resp);

//       if (this.loginForm.get('rememberMe').value) {
//         localStorage.setItem('email', this.loginForm.get('email').value);
//       } else {
//         localStorage.removeItem('email');
//       }
//       // navegar al dashboard
//       this.router.navigateByUrl('/');
//     },
//     error: (err) => {
//       Swal.fire('Error', err.error.msg, 'error');
//     },
//   });

//   // console.log(this.loginForm.value)
// var
// var id_token = googleUser.getAuthResponse().id_token;

//   renderButton() {
//     gapi.signin2.render('my-signin2', {
//       scope: 'profile email',
//       width: 240,
//       height: 50,
//       longtitle: true,
//       theme: 'dark',
//     });
//     this.startApp();
//   }
//   async startApp() {
//     await this.userService.googleInit();
//     this.auth2 = this.userService.auth2;
//     this.attachSignin(document.getElementById('my-signin2'));
//   }
//   attachSignin(element: any) {
//     this.auth2.attachClickHandler(
//       element,
//       {},
//       (googleUser: any) => {
//         const id_token = googleUser.getAuthResponse().id_token;
//         // console.log(id_token);
//         this.userService.loginGoogle(id_token).subscribe((resp) => {
//           // navegar al dashboard
//           this.ngZone.run(() => {
//             this.router.navigateByUrl('/');
//           });
//         });
//       },
//       (error: any) => {
//         alert(JSON.stringify(error, undefined, 2));
//       }
//     );
//   }

// function signOut() {
//   var auth2 = gapi.auth2.getAuthInstance();
//   auth2.signOut().then(function () {
//     console.log('User signed out.');
// });
