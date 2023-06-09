import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

// import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  public formSubmitted = false;

  public registerForm: any = this.fb.group(
    {
      name: ['elcastri', Validators.required],
      email: ['elcastri1@hotmail.com', [Validators.required, Validators.email]],
      password: ['elcastri', Validators.required],
      password2: ['elcastri', Validators.required],
      terms: [false, Validators.required],
    },
    {
      validators: this.matchingPasswords('password', 'password2'),
    }
  );

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  async register() {
    this.formSubmitted = true;
    console.log(this.registerForm);
    const { name, email, password } = this.registerForm.value;
    try {
      const userCredential = this.userService.register(email, password, name);
      console.log(userCredential);
      // if (this.registerForm.invalid) {
      //   return;
      // }

      // Posting sign up body values
      this.userService.register(email, password, name);
      Swal.fire('Completado', `Usuario ${name} Autenticado`, 'success');
      this.router.navigateByUrl('/');
    } catch (err: any) {
      // console.error(err);
      Swal.fire('Error', err.error.msg, 'error');
    }
  }

  notValidField(field: string): boolean {
    if (this.registerForm.get(field).invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  notValidPassword() {
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if (pass1 !== pass2 && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  acceptTerms() {
    return !this.registerForm.get('terms').value && this.formSubmitted; //si el check de terms esta en false y ya se presiono submit...
  }
  matchingPasswords(pass1Name: string, pass2Name: string) {
    return (formGroup: FormGroup) => {
      const pass1Control: any = formGroup.get(pass1Name);
      const pass2Control: any = formGroup.get(pass2Name);

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ doesNotMatch: true });
      }
    };
  }
}
