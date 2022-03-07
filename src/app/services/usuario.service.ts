import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuarios } from '../interfaces/cargar-usuarios.interface';

const base_url = environment.base_url;
declare const gapi: any;


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario!: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {

    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE'|'USER_ROLE'{
    return this.usuario.role!;
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {

    return {
      headers: {
        'x-token':this.token
      }
    }
  }

  googleInit() {
    return new Promise((resolve: any) => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '213287627438-27aeisf1l9kfr7ukju7srp4uvjq6kru5.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin'
        });

        resolve();

      });

    })
  }

  guardarLocalStorage(token:string,menu:any) {

    localStorage.setItem('token', token);
    localStorage.setItem('menu',JSON.stringify(menu));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    //TODO: Borrar menu

    this.auth2.signOut().then(() => {

      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });

    });
  }

  validarToken(): Observable<boolean> {

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((res: any) => {

        const { email, google, nombre, role, img = '', uid } = res.usuario;
      
        this.usuario = new Usuario(nombre, email, '', google, img, role, uid);
        this.guardarLocalStorage(res.token, res.menu);
        return true;
      }),

      catchError(error => of(false))
    );

  }

  crearUsuario(formData: RegisterForm) {

    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((res: any) => {
          this.guardarLocalStorage(res.token, res.menu);
        })
      )
  }

  actualizarPerfil(data: { email: string, nombre: string, role: string }) {

    data = {
      ...data,
      role: this.usuario.role!
    };

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers);
  }

  login(formData: LoginForm) {

    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((res: any) => {
          this.guardarLocalStorage(res.token, res.menu);
        })
      )
  }

  loginGoogle(token: string) {

    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((res: any) => {
          this.guardarLocalStorage(res.token, res.menu);
        })
      );
  }

  cargarUsuarios(desde: number = 0) {

    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuarios>(url, this.headers)
      .pipe(
        map(
          res => {
            const usuarios = res.usuarios.map(user => new Usuario(user.nombre, user.email, '', user.google, user.img, user.role, user.uid));
            return {
              total:res.total,
              usuarios
            }
          }
        )
      );

  }

  eliminarUsuario(usuario:Usuario) {


    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers);


  }

  guardarUsuario(usuario: Usuario) {

    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers);
  }

}


