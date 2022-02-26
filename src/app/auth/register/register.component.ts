import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']

})
export class RegisterComponent implements OnInit {

  public formSubmitted = false;

  public registerForm = this.fb.group({
    nombre: ['Angel', [Validators.required, Validators.minLength(3)]],
    email: ['test100@gmail.com',[Validators.required,Validators.email]],
    password: ['123456',Validators.required],
    password2: ['123',Validators.required],
    terminos: [false,Validators.required]
  }, {
    validators:this.passwordIguales('password','password2')
  });

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {

  }


  crearUsuario() {
    this.formSubmitted = true;
    console.log(this.registerForm.value);

    if (this.registerForm.invalid||this.aceptaTerminos()) {
      return;
    }


    this.usuarioService.crearUsuario(this.registerForm.value).subscribe(
      res => {
        //Mover al dashboard
        this.router.navigateByUrl('/');
      }, err => {
        console.warn(err.error.msg);
        Swal.fire('Error', err.error.msg, 'error');
    }
    );

  }

  campoNoValido(campo:string): boolean {

    if (this.registerForm.get(campo)?.invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }

  }

  contrasenasNoValidas() {

    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value;
    if ((pass1 !== pass2) && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  aceptaTerminos() {
    return !this.registerForm.get('terminos')?.value && this.formSubmitted;

  }

  passwordIguales(pass:string,pass2:string) {

    return (formGroup:FormGroup) => {

      const pass1Control = formGroup.get(pass);
      const pass2Control = formGroup.get(pass2);

      if (pass1Control?.value === pass2Control?.value) {
        pass2Control?.setErrors(null)
      } else {
        pass2Control?.setErrors({ noEsIgual: true });
      }
    }

  }

}
