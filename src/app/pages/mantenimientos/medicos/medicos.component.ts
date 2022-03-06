import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit ,OnDestroy {

  public cargando:boolean = true;
  public medicos: Medico[] = [];
  private imgSubs:Subscription=new Subscription();

  constructor(
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService
  ) { }
  ngOnDestroy(): void {
     this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(150))
      .subscribe(img => this.cargarMedicos());

  }


  cargarMedicos() {

    this.cargando = true;
    this.medicoService.cargarMedicos().subscribe(
      res => {
        this.medicos = res;
        this.cargando = false;
        console.log(res);
      }
    )

  }

  abrirModal(medico: Medico) {

    this.modalImagenService.abrirModal('medicos', medico._id!, medico.img);
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      this.cargarMedicos();
      return;
    }

    this.busquedasService.buscar('medicos', termino).subscribe(
      res => {
        this.medicos = res as Medico[];
      }
    )
  }

  borrarMedico(medico: Medico) {

    Swal.fire({
      title: 'Borrar medico?',
      text: `Esta a punto de borrar a ${medico.nombre}!`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, Borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.borrarMedico(medico._id!).subscribe(
          res => {
            Swal.fire('Medico borrado', `${medico.nombre} fue eliminado correctamente`, 'success');
            this.cargarMedicos();
          },
          err => {
            console.log(err);
          }
        )
      }
    })
  }

}
