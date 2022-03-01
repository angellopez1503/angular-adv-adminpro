import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    private http: HttpClient
  ) { }

  // async actualizarFoto(
  //   archivo: File,
  //   tipo: 'usuarios' | 'medicos' | 'hospitales',
  //   id:string
  // ) {

  //   try {

  //     const url = `${base_url}/upload/${tipo}/${id}`;
  //     const formData = new FormData();
  //     formData.append('imagen', archivo);

  //     const res = await fetch(url, {
  //       method: 'put',
  //       headers: {
  //         'x-token': localStorage.getItem('token') || ''
  //       },
  //       body: formData
  //     });

  //     const data = await res.json();
  //     if (data.ok) {
  //       return data.nombreArchivo;
  //     } else {
  //       console.log(data.msg);
  //       return false;
  //     }


  //   } catch (error) {
  //     console.log(error);
  //     return false;
  //   }

  // }

   actualizarFoto(
    archivo: File,
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string
  ) {



      const url = `${base_url}/upload/${tipo}/${id}`;
      const formData = new FormData();
      formData.append('imagen', archivo);

     return this.http.put(url, formData, {
       headers: {
         'x-token': localStorage.getItem('token') || ''
       }
     })




  }



}
