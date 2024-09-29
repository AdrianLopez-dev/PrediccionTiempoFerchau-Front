import { Component, LOCALE_ID, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, formatDate } from '@angular/common';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import {
  Prediccion,
  ProbPrecipitacion,
} from '../../interfaces/PrediccionModel';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Importa MatProgressSpinnerModule

@Component({
  selector: 'app-prediccion-tiempo',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    MatFormFieldModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './prediccion-tiempo.component.html',
  styleUrl: './prediccion-tiempo.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }],
})
export class PrediccionTiempoComponent {
  cargando: boolean = true;
  municipios: Array<{ id: string; nombre: string }> = [];
  filtroControl = new FormControl('');
  municipiosFiltrados!: Observable<Array<{ id: string; nombre: string }>>;
  municipioSeleccionado: { id: string; nombre: string } | null = null;
  unidadTemperaturaSeleccionada = 'G_CEL';
  temperaturaMedia: number = 0;
  fecha = formatDate(new Date(), 'EEEE, dd MMMM yyyy', 'es-ES');
  probPrecipitacion: Array<ProbPrecipitacion> = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getAllMunicipios();
  }

  // Método para seleccionar una municipio y guardar su id
  seleccionarMunicipio(municipio: { id: string; nombre: string }) {
    this.municipioSeleccionado = municipio; // Guardamos el municipio seleccionado con su id
    this.filtroControl.setValue(municipio.nombre);
    this.getPrediccionTiempoDiaSiguiente();
  }

  // Método para controlar el cambios de la variable de temperatura
  onTemperatureChange() {
    if (!!this.municipioSeleccionado) {
      this.getPrediccionTiempoDiaSiguiente();
    }
  }

  // Servicio obtencion de todos los municipios
  private getAllMunicipios(): void {
    this.cargando = true;
    this.http
      .get<{ id: string; nombre: string }[]>('/api/municipios')
      .subscribe(
        (data) => {
          this.municipios = data;
          // Filtamos todos los municipos obtenidos
          this.municipiosFiltrados = this.filtroControl.valueChanges.pipe(
            startWith(''),
            map((valor) => this.filtrarMunicipios(valor || ''))
          );
          this.cargando = false;
        },
        (error) => {
          console.error('Error al obtener las municipios', error);
          this.cargando = false;
        }
      );
  }

  // Método para filtrar las municipios por nombre
  private filtrarMunicipios(
    valor: string
  ): Array<{ id: string; nombre: string }> {
    const valorFiltrado = valor;
    return this.municipios.filter((municipio) =>
      municipio.nombre.toUpperCase().includes(valorFiltrado.toUpperCase())
    );
  }

  // Servicio obtención de la prediccion para el dia siguiente
  private getPrediccionTiempoDiaSiguiente() {
    // Crear los parámetros de la URL
    let params = new HttpParams();

    this.cargando = true;

    // Solo agrega los parámetros si no son undefined
    if (!!this.municipioSeleccionado?.id) {
      params = params.set(
        'codigoMunicipio',
        this.municipioSeleccionado?.id.toString()
      );
    }

    if (!!this.unidadTemperaturaSeleccionada) {
      params = params.set(
        'unidadTemperatura',
        this.unidadTemperaturaSeleccionada
      );
    }
    this.http.get<Prediccion>('/api/obtenerPrediccion', { params }).subscribe(
      (respuesta) => {
        this.probPrecipitacion = respuesta.probPrecipitacion;
        this.temperaturaMedia = respuesta.mediaTemperatura;
        this.cargando = false;
      },
      (error) => {
        console.error(
          'Error al obtener la predición del tiempo para mañana',
          error
        );
        this.cargando = false;
      }
    );
  }
}
