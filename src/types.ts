export interface User {
  user_id: string;
  nombre: string;
  area: string;
  org_codigo: string;
  puntos_mes: number;
  puntos_total: number;
  clasificaciones: number;
  racha_dias: number;
  ultima_fecha: string;
  nivel: string;
}

export interface ClassificationResult {
  es_correcto: boolean;
  puntos: number;
  color_sugerido?: string;
  explicacion?: string;
  analisis_detallado?: {
    material: string;
    estado: string;
    motivo: string;
    tip_ecologico: string;
  };
  raw_text?: string;
}
