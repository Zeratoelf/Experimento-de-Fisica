
export interface Material {
  name: string;
  coefficient: number; // Coefficient of linear expansion (α) in 1/°C
}

export interface Materials {
  [key: string]: Material;
}
