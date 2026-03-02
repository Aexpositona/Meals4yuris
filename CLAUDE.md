# Meals4yuris

## Descripcion del proyecto
App movil de planificacion de comidas para compartir en pareja. Basada en un componente React existente (`meal-planner.tsx`) que se migrara a una app movil nativa/hibrida.

## Objetivo
- App movil (Android + iOS) para planificar comidas semanales en pareja
- Sincronizacion en tiempo real entre dos usuarios (pareja)
- Enfocada en cocina catalana/mediterranea
- Meta nutricional: dieta para ganar peso (objetivo >= 2800 kcal/dia)

## Funcionalidades actuales (del prototipo web)
1. **Plan semanal**: Asignar recetas a Comida/Cena de Lunes a Domingo (semana actual y proxima)
2. **Recetas**: 50 recetas predefinidas (cocina catalana/mediterranea) + CRUD de recetas personalizadas
3. **Despensa**: Marcar productos que tienes en casa (organizados por secciones: Frutas/Verduras, Carnes/Pescados, Lacteos, Despensa, Congelados, Limpieza, Otros)
4. **Lista de la compra**: Generada automaticamente segun el plan semanal menos lo que hay en despensa, con checkboxes
5. **Calorias**: Estimacion semanal de kcal/dia segun las recetas asignadas

## Funcionalidades nuevas (para la app movil)
- **Compartir con pareja**: Ambos usuarios ven y editan el mismo plan, despensa y lista de compra en tiempo real
- **Notificaciones**: Recordatorios de comida, alertas cuando la pareja modifica el plan
- **Modo offline**: Funcionar sin conexion y sincronizar al reconectar

## Stack tecnologico
- **Framework**: React Native con Expo (reutiliza conocimiento React del prototipo)
- **Backend/DB**: Supabase (auth, Postgres, realtime subscriptions para sync en pareja)
- **Estado local**: Zustand o React Context
- **Navegacion**: Expo Router (file-based routing)
- **Idioma de la UI**: Bilingue castellano/catalan (como el prototipo)

## Estructura del proyecto (planificada)
```
Meals4yuris/
  app/                  # Expo Router - pantallas
    (tabs)/
      plan.tsx          # Plan semanal
      recipes.tsx       # Listado y CRUD de recetas
      pantry.tsx        # Despensa
      shop.tsx          # Lista de la compra
    _layout.tsx         # Layout principal con tabs
  components/           # Componentes reutilizables
  lib/
    supabase.ts         # Cliente Supabase
    store.ts            # Estado global
    recipes.ts          # Datos de recetas predefinidas
    types.ts            # Tipos TypeScript
  assets/               # Iconos, imagenes
  CLAUDE.md
```

## Tema visual
- Dark mode por defecto
- Colores principales:
  - Purple (acento): `#8420CD`
  - Green (confirmacion/en casa): `#328A2C`
  - Red (alerta/falta): `#b83232`
  - Background: `#0d0d0d`
  - Cards: `#1a1a1a` / `#222`
  - Border: `#2a2a2a`
  - Text: `#e5e5e5` (primario), `#999` (secundario), `#555` (terciario)

## Modelo de datos
### Recipe
```ts
{ id: string, name: string, cal: number, ingredients: Ingredient[] }
```
### Ingredient
```ts
{ name: string, qty: number, unit: string, section: string }
```
### Plan
```ts
Record<string, string>  // key: "{week}-{day}-{meal}", value: recipeId
```
### Pantry
```ts
Record<string, boolean>  // key: nombre item en lowercase
```

## Secciones de despensa
- Frutas/Verduras, Carnes/Pescados, Lacteos, Despensa, Congelados, Limpieza, Otros

## Archivo fuente original
- `C:\Users\ktmel\Downloads\meal-planner.tsx` — Componente React original con las 50 recetas y toda la logica

## Convenciones
- Codigo en ingles, UI en castellano/catalan
- Componentes funcionales con hooks
- TypeScript estricto
- Recetas para 2 personas
