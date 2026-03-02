export interface Ingredient {
  name: string;
  qty: number;
  unit: string;
  section: string;
}

export interface Recipe {
  id: string;
  name: string;
  cal: number;
  ingredients: Ingredient[];
}

export type Plan = Record<string, string>; // "{week}-{day}-{meal}" -> recipeId
export type Pantry = Record<string, boolean>; // item name lowercase -> true
export type CheckedItems = Record<string, boolean>;
export type CustomPantryItems = Record<string, string[]>;

export const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const;
export const MEALS = ['Comida', 'Cena'] as const;
export const SECTIONS = [
  '🥬 Frutas/Verduras',
  '🥩 Carnes/Pescados',
  '🧀 Lácteos',
  '🫙 Despensa',
  '🧊 Congelados',
  '🧹 Limpieza',
  '🛒 Otros',
] as const;
