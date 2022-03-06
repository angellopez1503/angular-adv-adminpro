import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit ,OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  private imgSubs:Subscription = new Subscription();

  constructor(
    private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService
  ) { }
  ngOnDestroy(): void {
     this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {

    this.cargarHospitales();
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(150))
      .subscribe(img => this.cargarHospitales());

  }

  buscar(termino: string) {

    if (termino.length === 0) {
      this.cargarHospitales();
      return;
    }

    this.busquedasService.buscar('hospitales', termino).subscribe(
      res => {
        this.hospitales = res as Hospital[];
      }
    )
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales().subscribe(
      res => {
        this.cargando = false;
        this.hospitales = res;
      }
    )
  }

  guardarCambios(hospital: Hospital) {

    this.hospitalService.actualizarHospital(hospital._id!, hospital.nombre).subscribe(
      res => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
      },
      err => {
        console.log(err);
      }
    )
  }

  eliminarHospital(hospital: Hospital) {
    // this.hospitalService.borrarHospital(hospital._id!).subscribe(
    //   res => {
    //     this.cargarHospitales();
    //     Swal.fire('Borrado', hospital.nombre, 'success');
    //   }
    // )


    Swal.fire({
      title: 'Borrar hospital?',
      text: `Esta a punto de borrar a ${hospital.nombre}!`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, Borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalService.borrarHospital(hospital._id!).subscribe(
          res => {
            Swal.fire('Hospital borrado', `${hospital.nombre} fue eliminado correctamente`, 'success');
            this.cargarHospitales();
          },
          err => {
            console.log(err);
          }
        )
      }
    })

  }

  async abrirSweetAlert() {

    const {value=''} = await Swal.fire<string>({
      title:'Crear hospital',
      text:'Ingrese el nombre del nuevo hospital',
      input: 'text',
      showCancelButton: true,
      inputPlaceholder: 'Nombre del hospital'
    })

    if (value!.trim().length > 0) {

      this.hospitalService.crearHospital(value!).subscribe(
        (res:any) => {
          this.hospitales.push(res.hospital);
        },
        err => {

        }

      )

     }
  }

  abrirModal(hospital: Hospital) {

    this.modalImagenService.abrirModal('hospitales', hospital._id!, hospital.img);

  }


}
