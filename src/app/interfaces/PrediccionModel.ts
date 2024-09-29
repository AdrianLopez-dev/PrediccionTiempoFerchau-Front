export interface Prediccion {
  mediaTemperatura: number;
  unidadTemperatura: string;
  probPrecipitacion: ProbPrecipitacion[];
}

export interface ProbPrecipitacion {
  value: number;
  periodo: string;
}
