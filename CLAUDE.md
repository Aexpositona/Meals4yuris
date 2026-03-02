# Meals4yuris

## Descripcion del proyecto
App movil de planificacion de comidas para compartir en pareja. Basada en un componente React existente (`meal-planner.tsx`) migrada a React Native con Expo.

## Objetivo
- App movil (Android + iOS) para planificar comidas semanales en pareja
- Sincronizacion en tiempo real entre dos usuarios (pareja)
- Enfocada en cocina catalana/mediterranea
- Meta nutricional: dieta para ganar peso (objetivo >= 2800 kcal/dia)

## Estado actual
- Proyecto inicializado con Expo SDK 54 (compatible con Expo Go)
- 4 pantallas funcionales: Plan semanal, Recetas, Despensa, Lista de compra
- 50 recetas predefinidas migradas del prototipo
- Zustand store con persistencia AsyncStorage
- Dark theme aplicado
- TypeScript strict, 0 errores, 0 vulnerabilidades
- Repo privado: github.com/Aexpositona/Meals4yuris (branch main)
- Git config: Alejandro <aexpositona@gmail.com>

## Pendiente (proximos pasos)
- [ ] Supabase: crear proyecto, tablas y auth para sync en pareja
- [ ] Compartir con pareja: realtime subscriptions
- [ ] Notificaciones push
- [ ] Modo offline con sync al reconectar
- [ ] Pulir UI/UX movil (animaciones, haptics)
- [ ] Icono y splash screen personalizados

## Stack tecnologico
- **Framework**: React Native con Expo SDK 54
- **Backend/DB**: Supabase (auth, Postgres, realtime) — cliente preparado en lib/supabase.ts
- **Estado local**: Zustand (lib/store.ts)
- **Persistencia**: AsyncStorage
- **Navegacion**: Expo Router v6 (file-based routing)
- **Idioma UI**: Bilingue castellano/catalan

## Estructura del proyecto
```
Meals4yuris/
  app/
    (tabs)/
      _layout.tsx       # Tab bar con 4 tabs (emojis)
      index.tsx         # Plan semanal (tab Semana)
      recipes.tsx       # CRUD de recetas (tab Recetas)
      pantry.tsx        # Despensa en casa/falta (tab Despensa)
      shop.tsx          # Lista de compra auto-generada (tab Compra)
    _layout.tsx         # Root layout con dark theme forzado
    +not-found.tsx
  components/           # Hooks de color scheme, client-only values
  constants/
    Colors.ts           # Tema: C.purple, C.green, C.red, C.bg, C.card, etc.
  lib/
    supabase.ts         # Cliente Supabase (lee de .env.local)
    store.ts            # Zustand store global con persistencia
    recipes.ts          # 50 recetas + BASE_PANTRY_ITEMS
    types.ts            # Recipe, Ingredient, Plan, Pantry, DAYS, MEALS, SECTIONS
  assets/               # Fuentes, iconos, imagenes
  .env.local            # EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY
  CLAUDE.md
```

## Tema visual
- Dark mode forzado
- Colores (definidos en constants/Colors.ts como `C`):
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
- `C:\Users\ktmel\Downloads\meal-planner.tsx` — Componente React original

## Convenciones
- Codigo en ingles, UI en castellano/catalan
- Componentes funcionales con hooks
- TypeScript estricto
- StyleSheet.create para estilos (no inline)
- Recetas para 2 personas

## Desarrollo
- Preview: `npx expo start --tunnel` + Expo Go en movil
- Web: `npx expo start --web` en http://localhost:8081
- PowerShell: usar `;` en vez de `&&` para encadenar comandos
