export interface Prediccion {
  mediaTemperatura: number;
  unidadTemperatura: string;
  probPrecipitacion: ProbPrecipitacion[];
}

export interface ProbPrecipitacion {
  probabilidad: number;
  periodo: string;
}
