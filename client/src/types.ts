
export type ReporteType = {
  id:string
  lat: number;
  lng: number;
  creado: string;
  horas_duracion: number
}

export type ReporteResponseType = {
  reportes: ReporteType[];
  total: number;
  limit: number;
  offset: number;
}

export type ReporteRequestType = {
  id_usuario:string
  lat: number;
  lng: number;
  horas_duracion: number
}