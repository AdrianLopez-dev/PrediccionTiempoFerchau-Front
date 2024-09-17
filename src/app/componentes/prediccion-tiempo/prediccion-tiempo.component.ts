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
  isLoading: boolean = true; // Estado de carga para controlar el loader
  municipios: Array<{ id: string; nombre: string }> = []; // Listado de municipios con id y nombre
  filtroControl = new FormControl(''); // Control para el campo de búsqueda
  municipiosFiltrados!: Observable<Array<{ id: string; nombre: string }>>; // Municipios filtradas para mostrar

  municipioSeleccionado: { id: string; nombre: string } | null = null; // Municipios seleccionada con su id

  unidadTemperaturaSeleccionada = 'G_CEL';
  temperaturaMedia: number = 0;

  fecha = formatDate(new Date(), 'EEEE, dd MMMM yyyy', 'es-ES'); // Formateo en español

  probPrecipitacion: Array<ProbPrecipitacion> = []; // Para almacenar la probabilidad de precipitación

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getAllMunicipios();
  }

  private getAllMunicipios(): void {
    this.isLoading = true;
    this.http
      .get<{ id: string; nombre: string }[]>('/api/municipios')
      .subscribe(
        (data) => {
          this.municipios = data; // Guardamos los datos recibidos
          this.municipiosFiltrados = this.filtroControl.valueChanges.pipe(
            startWith(''),
            map((valor) => this.filtrarMunicipios(valor || ''))
          );
          this.isLoading = false;
        },
        (error) => {
          console.error('Error al obtener las municipios', error);
          this.isLoading = false;
        }
      );
  }

  // Método para seleccionar una municipio y guardar su id
  seleccionarMunicipio(municipio: { id: string; nombre: string }) {
    this.municipioSeleccionado = municipio; // Guardamos el municipio seleccionado con su id
    this.filtroControl.setValue(municipio.nombre);
    this.getPrediccionTiempoDiaSiguiente();
  }

  onTemperatureChange() {
    if (!!this.municipioSeleccionado) {
      this.getPrediccionTiempoDiaSiguiente();
    }
  }

  // Método para filtrar las municipios por nombre
  private filtrarMunicipios(
    valor: string
  ): Array<{ id: string; nombre: string }> {
    const valorFiltrado = valor;
    return this.municipios.filter((municipio) =>
      municipio.nombre.toLocaleUpperCase().includes(valorFiltrado)
    );
  }

  private getPrediccionTiempoDiaSiguiente() {
    // Crear los parámetros de la URL
    let params = new HttpParams();

    this.isLoading = true;

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
        this.isLoading = false;
      },
      (error) => {
        console.error(
          'Error al obtener la predición del tiempo para mañana',
          error
        );
        this.isLoading = false;
      }
    );
  }
}
