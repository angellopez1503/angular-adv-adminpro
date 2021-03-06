import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {


  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado?: Hospital;
  public medicoSeleccionado?: Medico;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(
      ({ id }) => {
        this.cargarMedico(id);
      }
    )

    // this.medicoService.obtenerMedicoPorId

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    });

    this.cargarHospitales();
    this.medicoForm.get('hospital')?.valueChanges.subscribe(
      hospitalId => {
        this.hospitalSeleccionado = this.hospitales.find(h => h._id === hospitalId);

      }

    )
  }

  cargarMedico(id: string) {

    if (id === 'nuevo') {
      return;
    }

    this.medicoService.obtenerMedicoPorId(id)
      .pipe(
        delay(100)
      )
      .subscribe(
      (res: Medico) => {

        if (!res) {
          this.router.navigateByUrl(`dashboard/medicos`);
          return
        }
        const { nombre, hospital } = res;
        this.medicoSeleccionado = res;
        this.medicoForm.setValue({ nombre, hospital: hospital?._id });
      }
    )

  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales().subscribe(
      (res: Hospital[]) => {
        this.hospitales = res;
      }
    )
  }

  guardarMedico() {

    const { nombre } = this.medicoForm.value;

    if (this.medicoSeleccionado) {
      //Actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id

      }
      this.medicoService.actualizarMedico(data).subscribe(
        res => {
          Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success');
        }
      )
    } else {
      //Crear

      this.medicoService.crearMedico(this.medicoForm.value).subscribe(
        (res: any) => {
          Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${res.medico._id}`)
        }
      )

    }
  }

}
