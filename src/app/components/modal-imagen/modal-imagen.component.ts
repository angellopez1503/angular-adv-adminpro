import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir!: File;
  public imgTemp: any = null;

  constructor(
    public modalImagenService: ModalImagenService,
    public fileUploadService: FileUploadService
  ) { }

  ngOnInit(): void {
  }

  cerrarModal() {

    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
  }

  cambiarImagen(file: File) {

    this.imagenSubir = file;

    if (!file) {
      this.imgTemp = null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;

    }

  }

  subirImagen() {

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService.actualizarFoto(this.imagenSubir, tipo,id)
      .subscribe(
        (img: any) => {

          Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success')
          this.modalImagenService.nuevaImagen.emit(img);
          this.cerrarModal();
        },
        err => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error').then(() => {
            this.imgTemp = null;
          });

        }
      )
  }



}
